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
  checkKeyboardAccessibility,
  checkFocusIndicator,
  checkTiming,
  checkMotionActuation,
  checkPointerGestures,
  checkPointerCancellation,
  checkTargetSize,
  type KeyboardAccessibilityInput,
  type FocusIndicatorInput,
  type TimingInput,
  type MotionInput,
} from "./checks.js";
import { KEYBOARD_TOOLS } from "./tools.js";

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-keyboard-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: KEYBOARD_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "check_keyboard_access": {
        const results = checkKeyboardAccessibility(args as unknown as KeyboardAccessibilityInput);
        const report = createReport(results, { title: "WCAG Keyboard Access Check", category: "keyboard" });
        return { content: formatToolResponse(report) };
      }

      case "check_focus_indicator": {
        const results = checkFocusIndicator(args as unknown as FocusIndicatorInput);
        const report = createReport(results, { title: "WCAG Focus Indicator Check", category: "keyboard" });
        return { content: formatToolResponse(report) };
      }

      case "check_timing": {
        const results = checkTiming(args as unknown as TimingInput);
        const report = createReport(results, { title: "WCAG Timing Check", category: "keyboard" });
        return { content: formatToolResponse(report) };
      }

      case "check_motion": {
        const results = checkMotionActuation(args as unknown as MotionInput);
        const report = createReport(results, { title: "WCAG Motion Actuation Check", category: "keyboard" });
        return { content: formatToolResponse(report) };
      }

      case "check_pointer_gestures": {
        const { hasMultipointGestures, hasPathBasedGestures, hasSinglePointerAlternative, isEssential } = args as {
          hasMultipointGestures: boolean;
          hasPathBasedGestures: boolean;
          hasSinglePointerAlternative?: boolean;
          isEssential?: boolean;
        };
        const results = checkPointerGestures({ hasMultipointGestures, hasPathBasedGestures, hasSinglePointerAlternative, isEssential });
        const report = createReport(results, { title: "WCAG Pointer Gestures Check", category: "keyboard" });
        return { content: formatToolResponse(report) };
      }

      case "check_pointer_cancellation": {
        const { elementType, activatesOnDown, canAbort, canUndo, isEssential } = args as {
          elementType: string;
          activatesOnDown?: boolean;
          canAbort?: boolean;
          canUndo?: boolean;
          isEssential?: boolean;
        };
        const results = checkPointerCancellation({ elementType, activatesOnDown, canAbort, canUndo, isEssential });
        const report = createReport(results, { title: "WCAG Pointer Cancellation Check", category: "keyboard" });
        return { content: formatToolResponse(report) };
      }

      case "check_target_size": {
        const { elementType, width, height, hasSpacing } = args as {
          elementType: string;
          width: number;
          height: number;
          hasSpacing?: boolean;
        };
        const results = checkTargetSize({ elementType, width, height, hasSpacing });
        const report = createReport(results, { title: "WCAG Target Size Check", category: "keyboard" });
        return { content: formatToolResponse(report) };
      }

      case "get_wcag_keyboard_criteria": {
        const criteria = getCriteriaByCategory("keyboard");
        const formatted = criteria
          .map(c => `[${c.id}] ${c.name} (Level ${c.level})\n   ${c.description}\n   ${c.url}`)
          .join("\n\n");
        return {
          content: [
            { type: "text", text: "WCAG 2.1 Keyboard-Related Success Criteria\n\n" + formatted },
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
  console.error("WCAG Keyboard MCP server v1.0.0 running on stdio");
}

main().catch(console.error);
