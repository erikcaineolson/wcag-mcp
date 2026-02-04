#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  createReport,
  formatToolResponse,
  formatErrorResponse,
  getCriteriaByCategory,
} from "@wcag-mcp/core";
import {
  checkCaptions,
  checkAudioDescription,
  checkTranscript,
  checkMediaControls,
  checkAnimation,
  checkFlashing,
  checkSignLanguage,
  type CaptionInput,
  type AudioDescriptionInput,
  type TranscriptInput,
  type MediaControlInput,
  type AnimationInput,
  type FlashingInput,
} from "./checks.js";
import { MEDIA_TOOLS } from "./tools.js";

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-media-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: MEDIA_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "check_captions": {
        const results = checkCaptions(args as unknown as CaptionInput);
        const report = createReport(results, { title: "WCAG Captions Check", category: "media" });
        return { content: formatToolResponse(report) };
      }

      case "check_audio_description": {
        const results = checkAudioDescription(args as unknown as AudioDescriptionInput);
        const report = createReport(results, { title: "WCAG Audio Description Check", category: "media" });
        return { content: formatToolResponse(report) };
      }

      case "check_transcript": {
        const results = checkTranscript(args as unknown as TranscriptInput);
        const report = createReport(results, { title: "WCAG Transcript Check", category: "media" });
        return { content: formatToolResponse(report) };
      }

      case "check_media_controls": {
        const results = checkMediaControls(args as unknown as MediaControlInput);
        const report = createReport(results, { title: "WCAG Media Controls Check", category: "media" });
        return { content: formatToolResponse(report) };
      }

      case "check_animation": {
        const results = checkAnimation(args as unknown as AnimationInput);
        const report = createReport(results, { title: "WCAG Animation Check", category: "media" });
        return { content: formatToolResponse(report) };
      }

      case "check_flashing": {
        const results = checkFlashing(args as unknown as FlashingInput);
        const report = createReport(results, { title: "WCAG Flashing Content Check", category: "media" });
        return { content: formatToolResponse(report) };
      }

      case "check_sign_language": {
        const { hasAudioContent, isPrerecorded, hasSignLanguage } = args as {
          hasAudioContent: boolean;
          isPrerecorded: boolean;
          hasSignLanguage: boolean;
        };
        const results = checkSignLanguage({ hasAudioContent, isPrerecorded, hasSignLanguage });
        const report = createReport(results, { title: "WCAG Sign Language Check", category: "media" });
        return { content: formatToolResponse(report) };
      }

      case "get_wcag_media_criteria": {
        const criteria = getCriteriaByCategory("media");
        const formatted = criteria
          .map(c => `[${c.id}] ${c.name} (Level ${c.level})\n   ${c.description}\n   ${c.url}`)
          .join("\n\n");
        return {
          content: [
            { type: "text", text: "WCAG 2.1 Media-Related Success Criteria\n\n" + formatted },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(criteria, null, 2) },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return formatErrorResponse(error);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WCAG Media MCP server v1.0.0 running on stdio");
}

main().catch(console.error);
