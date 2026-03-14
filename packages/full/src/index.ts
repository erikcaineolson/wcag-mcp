#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  WCAG_CRITERIA,
  getCriteriaByLevel,
  formatErrorResponse,
  formatMarkdownReport,
} from "@wcag-mcp/core";
import type { ValidationReport, CheckResult, WcagLevel, CheckStatus, ReportSummary, MachineReport } from "@wcag-mcp/core";

// Import all tool handlers - we'll re-export their tools
// Note: In a real implementation, you'd import the actual check functions
// For now, we'll create a unified tool list and delegate to the individual servers

// =============================================================================
// Unified Tool Registry
// =============================================================================

// We'll define meta-tools that provide overview capabilities
// Individual category tools are available via the specialized servers

const META_TOOLS = [
  {
    name: "get_all_wcag_criteria",
    description: "Get all WCAG 2.1 success criteria organized by category.",
    inputSchema: {
      type: "object" as const,
      properties: {
        level: {
          type: "string",
          enum: ["A", "AA", "AAA", "all"],
          description: "Filter by conformance level",
        },
        category: {
          type: "string",
          enum: ["text", "keyboard", "aria", "media", "forms", "structure", "all"],
          description: "Filter by category",
        },
      },
    },
  },
  {
    name: "get_wcag_checklist",
    description: "Get a checklist of WCAG criteria for a specific conformance level.",
    inputSchema: {
      type: "object" as const,
      properties: {
        level: {
          type: "string",
          enum: ["A", "AA", "AAA"],
          description: "Target conformance level (includes lower levels)",
        },
      },
      required: ["level"],
    },
  },
  {
    name: "wcag_help",
    description: "Get help on WCAG MCP tools and how to use them.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "export_report",
    description: "Export WCAG validation results to a Markdown file. Pass the machine-readable JSON from any WCAG check tool's output. The file is saved as WCAG_Results_YYYY-MM-DD.md in the specified directory (defaults to current directory).",
    inputSchema: {
      type: "object" as const,
      properties: {
        results: {
          type: "object",
          description: "The machine-readable JSON object from any WCAG check tool response (the MACHINE-READABLE block).",
          properties: {
            wcagVersion: { type: "string" },
            timestamp: { type: "string" },
            category: { type: "string" },
            summary: {
              type: "object",
              properties: {
                total: { type: "number" },
                passed: { type: "number" },
                failed: { type: "number" },
                warnings: { type: "number" },
              },
            },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  criterion: { type: "string" },
                  name: { type: "string" },
                  level: { type: "string" },
                  status: { type: "string" },
                  message: { type: "string" },
                  value: {},
                  required: {},
                  recommendation: { type: "string" },
                  url: { type: "string" },
                },
              },
            },
          },
        },
        outputDir: {
          type: "string",
          description: "Directory to save the report file. Defaults to current working directory.",
        },
        title: {
          type: "string",
          description: "Custom report title. Defaults to 'WCAG Accessibility Report'.",
        },
        url: {
          type: "string",
          description: "URL of the page that was audited (optional, included in report metadata).",
        },
        notes: {
          type: "string",
          description: "Additional notes to include in the report.",
        },
      },
      required: ["results"],
    },
  },
];

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: META_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_all_wcag_criteria": {
        const { level, category } = (args || {}) as { level?: string; category?: string };

        let criteria = Object.values(WCAG_CRITERIA);

        // Filter by level
        if (level && level !== "all") {
          if (level === "A") {
            criteria = criteria.filter(c => c.level === "A");
          } else if (level === "AA") {
            criteria = criteria.filter(c => c.level === "A" || c.level === "AA");
          } else if (level === "AAA") {
            // All levels
          }
        }

        // Filter by category
        if (category && category !== "all") {
          criteria = criteria.filter(c => c.category === category);
        }

        // Group by category
        const grouped: Record<string, typeof criteria> = {};
        for (const c of criteria) {
          const cat = c.category || "other";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(c);
        }

        // Format output
        const lines: string[] = [];
        lines.push("WCAG 2.1 Success Criteria");
        lines.push(`Filters: Level=${level || "all"}, Category=${category || "all"}`);
        lines.push(`Total: ${criteria.length} criteria\n`);

        for (const [cat, items] of Object.entries(grouped).sort()) {
          lines.push(`\n## ${cat.toUpperCase()} (${items.length})`);
          lines.push("─".repeat(50));
          for (const c of items.sort((a, b) => a.id.localeCompare(b.id))) {
            lines.push(`[${c.id}] ${c.name} (Level ${c.level})`);
            lines.push(`   ${c.description}`);
          }
        }

        return {
          content: [
            { type: "text", text: lines.join("\n") },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(grouped, null, 2) },
          ],
        };
      }

      case "get_wcag_checklist": {
        const { level } = args as { level: "A" | "AA" | "AAA" };

        const levels: Array<"A" | "AA" | "AAA"> =
          level === "A" ? ["A"] :
          level === "AA" ? ["A", "AA"] :
          ["A", "AA", "AAA"];

        const criteria = Object.values(WCAG_CRITERIA)
          .filter(c => levels.includes(c.level))
          .sort((a, b) => a.id.localeCompare(b.id));

        const lines: string[] = [];
        lines.push(`WCAG 2.1 Level ${level} Checklist`);
        lines.push(`(Includes ${levels.join(" + ")} criteria)`);
        lines.push(`Total: ${criteria.length} criteria to check\n`);
        lines.push("═".repeat(60));

        let currentCategory = "";
        for (const c of criteria) {
          if (c.category !== currentCategory) {
            currentCategory = c.category || "other";
            lines.push(`\n### ${currentCategory.toUpperCase()}`);
          }
          lines.push(`☐ [${c.id}] ${c.name} (${c.level})`);
        }

        lines.push("\n" + "═".repeat(60));
        lines.push("\nUse individual check tools for detailed validation:");
        lines.push("- Text: check_contrast, check_text_spacing, validate_text");
        lines.push("- Keyboard: check_keyboard_access, check_focus_indicator");
        lines.push("- ARIA: check_name_role_value, check_status_message");
        lines.push("- Media: check_captions, check_audio_description");
        lines.push("- Forms: check_form_labels, check_error_identification");
        lines.push("- Structure: check_heading_structure, check_page_title");

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      case "wcag_help": {
        const help = `
WCAG MCP Server Suite - Help
════════════════════════════════════════════════════════════

This is the umbrella server providing overview tools.
For detailed validation, use the specialized servers:

AVAILABLE SERVERS
─────────────────
• @wcag-mcp/text      - Color contrast, text spacing, language
• @wcag-mcp/keyboard  - Keyboard access, focus, timing, gestures
• @wcag-mcp/aria      - Name/role/value, status messages, landmarks
• @wcag-mcp/media     - Captions, audio description, animations
• @wcag-mcp/forms     - Labels, errors, input purpose
• @wcag-mcp/structure - Headings, titles, links, navigation

COMMON WORKFLOWS
────────────────
1. Quick contrast check:
   Use check_contrast with foreground and background colors

2. Form validation:
   Use validate_form with array of field configurations

3. Page structure audit:
   Use check_heading_structure + check_page_title + check_bypass_blocks

4. Keyboard accessibility:
   Use check_keyboard_access + check_focus_indicator

5. Get full checklist:
   Use get_wcag_checklist with target level (A, AA, or AAA)

6. Export results to file:
   Run any check, then pass its MACHINE-READABLE JSON to export_report
   Saves as WCAG_Results_YYYY-MM-DD.md

CONFORMANCE LEVELS
──────────────────
Level A   - Minimum accessibility (30 criteria)
Level AA  - Standard conformance (50 criteria) - Most common target
Level AAA - Enhanced accessibility (78 criteria)

For detailed criteria info: get_all_wcag_criteria
For checklist by level: get_wcag_checklist
`.trim();

        return {
          content: [{ type: "text", text: help }],
        };
      }

      case "export_report": {
        const { results: machineData, outputDir, title, url, notes } = (args || {}) as {
          results: MachineReport;
          outputDir?: string;
          title?: string;
          url?: string;
          notes?: string;
        };

        // Reconstruct a ValidationReport from the machine data
        const checkResults: CheckResult[] = machineData.results.map(r => ({
          criterion: r.criterion,
          name: r.name,
          level: r.level as WcagLevel,
          status: r.status as CheckStatus,
          value: r.value,
          required: r.required,
          message: r.message,
          recommendation: r.recommendation,
        }));

        const passed = checkResults.filter(r => r.status === "pass");
        const failed = checkResults.filter(r => r.status === "fail");
        const warnings = checkResults.filter(r => r.status === "warning");

        const byLevel = (level: WcagLevel) => ({
          passed: checkResults.filter(r => r.level === level && r.status === "pass").length,
          failed: checkResults.filter(r => r.level === level && r.status === "fail").length,
        });

        const report: ValidationReport = {
          summary: {
            total: checkResults.length,
            passed: passed.length,
            failed: failed.length,
            warnings: warnings.length,
            levelA: byLevel("A"),
            levelAA: byLevel("AA"),
            levelAAA: byLevel("AAA"),
          },
          results: checkResults,
          human: "",
          machine: machineData,
        };

        const markdown = formatMarkdownReport(report, { title, url, notes });

        const date = machineData.timestamp
          ? machineData.timestamp.split("T")[0]
          : new Date().toISOString().split("T")[0];
        const filename = `WCAG_Results_${date}.md`;
        const dir = outputDir || process.cwd();
        const filepath = resolve(dir, filename);

        await writeFile(filepath, markdown, "utf-8");

        return {
          content: [
            { type: "text", text: `Report saved to: ${filepath}` },
            { type: "text", text: markdown },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}. Use wcag_help for available tools.`);
    }
  } catch (error) {
    return formatErrorResponse(error);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WCAG MCP (Full) server v1.0.0 running on stdio");
}

main().catch(console.error);
