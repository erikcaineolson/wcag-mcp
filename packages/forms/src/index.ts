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
  checkFormLabels,
  checkInputPurpose,
  checkErrorIdentification,
  checkErrorPrevention,
  checkInputConstraints,
  checkOnInput,
  validateForm,
  type FormFieldInput,
  type FormErrorInput,
  type FormSubmissionInput,
  type InputConstraintInput,
} from "./checks.js";
import { FORMS_TOOLS } from "./tools.js";

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-forms-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: FORMS_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "check_form_labels": {
        const results = checkFormLabels(args as unknown as FormFieldInput);
        const report = createReport(results, { title: "WCAG Form Labels Check", category: "forms" });
        return { content: formatToolResponse(report) };
      }

      case "check_input_purpose": {
        const results = checkInputPurpose(args as unknown as FormFieldInput);
        const report = createReport(results, { title: "WCAG Input Purpose Check", category: "forms" });
        return { content: formatToolResponse(report) };
      }

      case "check_error_identification": {
        const results = checkErrorIdentification(args as unknown as FormErrorInput);
        const report = createReport(results, { title: "WCAG Error Identification Check", category: "forms" });
        return { content: formatToolResponse(report) };
      }

      case "check_error_prevention": {
        const results = checkErrorPrevention(args as unknown as FormSubmissionInput);
        const report = createReport(results, { title: "WCAG Error Prevention Check", category: "forms" });
        return { content: formatToolResponse(report) };
      }

      case "check_input_constraints": {
        const results = checkInputConstraints(args as unknown as InputConstraintInput);
        const report = createReport(results, { title: "WCAG Input Constraints Check", category: "forms" });
        return { content: formatToolResponse(report) };
      }

      case "check_on_input": {
        const { elementType, changesContextOnInput, userWarned } = args as {
          elementType: string;
          changesContextOnInput: boolean;
          userWarned?: boolean;
        };
        const results = checkOnInput({ elementType, changesContextOnInput, userWarned });
        const report = createReport(results, { title: "WCAG On Input Check", category: "forms" });
        return { content: formatToolResponse(report) };
      }

      case "validate_form": {
        const { fields, errors } = args as {
          fields: FormFieldInput[];
          errors?: FormErrorInput;
        };
        const results = validateForm(fields, errors);
        const report = createReport(results, { title: "WCAG Form Validation Report", category: "forms" });
        return { content: formatToolResponse(report) };
      }

      case "get_wcag_forms_criteria": {
        const criteria = getCriteriaByCategory("forms");
        const formatted = criteria
          .map(c => `[${c.id}] ${c.name} (Level ${c.level})\n   ${c.description}\n   ${c.url}`)
          .join("\n\n");
        return {
          content: [
            { type: "text", text: "WCAG 2.1 Forms-Related Success Criteria\n\n" + formatted },
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
  console.error("WCAG Forms MCP server v1.0.0 running on stdio");
}

main().catch(console.error);
