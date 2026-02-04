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
  checkContrastRatio,
  checkTextSpacing,
  checkLineLength,
  checkLanguage,
  validateAll,
  type FullValidationInput,
} from "./checks.js";
import { TEXT_TOOLS } from "./tools.js";

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-text-mcp", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TEXT_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "check_contrast": {
        const { foreground, background, fontSize = 16, isBold = false } = args as {
          foreground: string;
          background: string;
          fontSize?: number;
          isBold?: boolean;
        };
        const results = checkContrastRatio(foreground, background, fontSize, isBold);
        const report = createReport(results, { title: "WCAG Contrast Check", category: "text" });
        return { content: formatToolResponse(report) };
      }

      case "check_text_spacing": {
        const { fontSize, lineHeight, letterSpacing, wordSpacing, paragraphSpacing } = args as {
          fontSize: number;
          lineHeight?: number;
          letterSpacing?: number;
          wordSpacing?: number;
          paragraphSpacing?: number;
        };
        const results = checkTextSpacing(fontSize, lineHeight, letterSpacing, wordSpacing, paragraphSpacing);
        const report = createReport(results, { title: "WCAG Text Spacing Check", category: "text" });
        return { content: formatToolResponse(report) };
      }

      case "check_line_length": {
        const { text } = args as { text: string };
        const results = checkLineLength(text);
        const report = createReport(results, { title: "WCAG Line Length Check", category: "text" });
        return { content: formatToolResponse(report) };
      }

      case "check_language": {
        const { hasLangAttribute, langValue } = args as { hasLangAttribute: boolean; langValue?: string };
        const results = checkLanguage(hasLangAttribute, langValue);
        const report = createReport(results, { title: "WCAG Language Check", category: "text" });
        return { content: formatToolResponse(report) };
      }

      case "validate_text": {
        const results = validateAll(args as unknown as FullValidationInput);
        const report = createReport(results, { title: "WCAG Text Accessibility Report", category: "text" });
        return { content: formatToolResponse(report) };
      }

      case "get_wcag_text_criteria": {
        const criteria = getCriteriaByCategory("text");
        const formatted = criteria
          .map(c => `[${c.id}] ${c.name} (Level ${c.level})\n   ${c.description}\n   ${c.url}`)
          .join("\n\n");
        return {
          content: [
            { type: "text", text: "WCAG 2.1 Text-Related Success Criteria\n\n" + formatted },
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
  console.error("WCAG Text MCP server v2.0.0 running on stdio");
}

main().catch(console.error);
