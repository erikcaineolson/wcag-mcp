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
  checkHeadingStructure,
  checkPageTitle,
  checkLinkPurpose,
  checkBypassBlocks,
  checkReadingOrder,
  checkInfoRelationships,
  checkMultipleWays,
  checkConsistentNavigation,
  checkConsistentIdentification,
  type HeadingStructureInput,
  type PageTitleInput,
  type LinkInput,
  type BypassBlocksInput,
  type ReadingOrderInput,
  type InfoRelationshipsInput,
  type MultipleWaysInput,
} from "./checks.js";
import { STRUCTURE_TOOLS } from "./tools.js";

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-structure-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: STRUCTURE_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "check_heading_structure": {
        const results = checkHeadingStructure(args as unknown as HeadingStructureInput);
        const report = createReport(results, { title: "WCAG Heading Structure Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_page_title": {
        const results = checkPageTitle(args as unknown as PageTitleInput);
        const report = createReport(results, { title: "WCAG Page Title Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_link_purpose": {
        const results = checkLinkPurpose(args as unknown as LinkInput);
        const report = createReport(results, { title: "WCAG Link Purpose Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_bypass_blocks": {
        const results = checkBypassBlocks(args as unknown as BypassBlocksInput);
        const report = createReport(results, { title: "WCAG Bypass Blocks Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_reading_order": {
        const results = checkReadingOrder(args as unknown as ReadingOrderInput);
        const report = createReport(results, { title: "WCAG Reading Order Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_info_relationships": {
        const results = checkInfoRelationships(args as unknown as InfoRelationshipsInput);
        const report = createReport(results, { title: "WCAG Info and Relationships Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_multiple_ways": {
        const results = checkMultipleWays(args as unknown as MultipleWaysInput);
        const report = createReport(results, { title: "WCAG Multiple Ways Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_consistent_navigation": {
        const { navigationElements } = args as {
          navigationElements: Array<{ page: string; order: string[] }>;
        };
        const results = checkConsistentNavigation({ navigationElements });
        const report = createReport(results, { title: "WCAG Consistent Navigation Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "check_consistent_identification": {
        const { components } = args as {
          components: Array<{ function: string; identifiers: string[] }>;
        };
        const results = checkConsistentIdentification({ components });
        const report = createReport(results, { title: "WCAG Consistent Identification Check", category: "structure" });
        return { content: formatToolResponse(report) };
      }

      case "get_wcag_structure_criteria": {
        const criteria = getCriteriaByCategory("structure");
        const formatted = criteria
          .map(c => `[${c.id}] ${c.name} (Level ${c.level})\n   ${c.description}\n   ${c.url}`)
          .join("\n\n");
        return {
          content: [
            { type: "text", text: "WCAG 2.1 Structure-Related Success Criteria\n\n" + formatted },
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
  console.error("WCAG Structure MCP server v1.0.0 running on stdio");
}

main().catch(console.error);
