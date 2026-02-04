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
  checkNameRoleValue,
  checkStatusMessage,
  checkAriaAttributes,
  checkLandmarks,
  checkLabelInName,
  type AriaElementInput,
  type StatusMessageInput,
  type NameRoleValueInput,
} from "./checks.js";
import { ARIA_TOOLS } from "./tools.js";

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-aria-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: ARIA_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "check_name_role_value": {
        const { element, states, statesAreCommunicated } = args as unknown as NameRoleValueInput;
        const results = checkNameRoleValue({ element, states, statesAreCommunicated });
        const report = createReport(results, { title: "WCAG Name, Role, Value Check", category: "aria" });
        return { content: formatToolResponse(report) };
      }

      case "check_status_message": {
        const results = checkStatusMessage(args as unknown as StatusMessageInput);
        const report = createReport(results, { title: "WCAG Status Message Check", category: "aria" });
        return { content: formatToolResponse(report) };
      }

      case "check_aria_attributes": {
        const element = args as unknown as AriaElementInput;
        const results = checkAriaAttributes(element);
        const report = createReport(results, { title: "WCAG ARIA Attributes Check", category: "aria" });
        return { content: formatToolResponse(report) };
      }

      case "check_landmarks": {
        const { landmarks } = args as { landmarks: Array<{ role: string; label?: string }> };
        const results = checkLandmarks(landmarks);
        const report = createReport(results, { title: "WCAG Landmarks Check", category: "aria" });
        return { content: formatToolResponse(report) };
      }

      case "check_label_in_name": {
        const { visibleLabel, accessibleName } = args as { visibleLabel: string; accessibleName: string };
        const results = checkLabelInName({ visibleLabel, accessibleName });
        const report = createReport(results, { title: "WCAG Label in Name Check", category: "aria" });
        return { content: formatToolResponse(report) };
      }

      case "get_wcag_aria_criteria": {
        const criteria = getCriteriaByCategory("aria");
        const formatted = criteria
          .map(c => `[${c.id}] ${c.name} (Level ${c.level})\n   ${c.description}\n   ${c.url}`)
          .join("\n\n");
        return {
          content: [
            { type: "text", text: "WCAG 2.1 ARIA-Related Success Criteria\n\n" + formatted },
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
  console.error("WCAG ARIA MCP server v1.0.0 running on stdio");
}

main().catch(console.error);
