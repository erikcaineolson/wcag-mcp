import type { ToolDefinition } from "@wcag-mcp/core";

export const ARIA_TOOLS: ToolDefinition[] = [
  {
    name: "check_name_role_value",
    description: "Check WCAG 4.1.2 Name, Role, Value. Validates elements have accessible names, valid roles, and communicated states.",
    inputSchema: {
      type: "object",
      properties: {
        element: {
          type: "object",
          description: "Element to check",
          properties: {
            tagName: { type: "string", description: "HTML tag name" },
            role: { type: "string", description: "ARIA role (explicit or implicit)" },
            accessibleName: { type: "string", description: "Computed accessible name" },
            accessibleDescription: { type: "string", description: "Computed accessible description" },
            isFocusable: { type: "boolean", description: "Whether element can receive focus" },
            isInteractive: { type: "boolean", description: "Whether element is interactive" },
            ariaAttributes: {
              type: "object",
              description: "ARIA attributes on the element",
              additionalProperties: { type: "string" },
            },
          },
          required: ["tagName"],
        },
        states: {
          type: "object",
          description: "Current ARIA states",
          properties: {
            expanded: { type: "boolean" },
            selected: { type: "boolean" },
            checked: { type: ["boolean", "string"], description: "true, false, or 'mixed'" },
            pressed: { type: ["boolean", "string"], description: "true, false, or 'mixed'" },
            disabled: { type: "boolean" },
            invalid: { type: "boolean" },
            required: { type: "boolean" },
            readonly: { type: "boolean" },
          },
        },
        statesAreCommunicated: { type: "boolean", description: "Whether state changes update ARIA attributes" },
      },
      required: ["element"],
    },
  },
  {
    name: "check_status_message",
    description: "Check WCAG 4.1.3 Status Messages. Validates status messages are announced without focus.",
    inputSchema: {
      type: "object",
      properties: {
        hasLiveRegion: { type: "boolean", description: "Whether element uses aria-live" },
        ariaLive: { type: "string", enum: ["polite", "assertive", "off"], description: "aria-live value" },
        ariaAtomic: { type: "boolean", description: "Whether aria-atomic is true" },
        hasStatusRole: { type: "boolean", description: "Whether role=\"status\" is used" },
        hasAlertRole: { type: "boolean", description: "Whether role=\"alert\" is used" },
        requiresFocus: { type: "boolean", description: "Whether message requires focus to perceive" },
      },
      required: ["hasLiveRegion"],
    },
  },
  {
    name: "check_aria_attributes",
    description: "Check ARIA attributes are used correctly per WAI-ARIA specification.",
    inputSchema: {
      type: "object",
      properties: {
        tagName: { type: "string", description: "HTML tag name" },
        role: { type: "string", description: "ARIA role" },
        isFocusable: { type: "boolean", description: "Whether element can receive focus" },
        isInteractive: { type: "boolean", description: "Whether element is interactive" },
        ariaAttributes: {
          type: "object",
          description: "ARIA attributes on the element",
          additionalProperties: { type: "string" },
        },
      },
      required: ["tagName"],
    },
  },
  {
    name: "check_landmarks",
    description: "Check landmark regions are properly labeled and unique.",
    inputSchema: {
      type: "object",
      properties: {
        landmarks: {
          type: "array",
          description: "Array of landmarks on the page",
          items: {
            type: "object",
            properties: {
              role: { type: "string", description: "Landmark role (main, navigation, etc.)" },
              label: { type: "string", description: "Accessible label for the landmark" },
            },
            required: ["role"],
          },
        },
      },
      required: ["landmarks"],
    },
  },
  {
    name: "check_label_in_name",
    description: "Check WCAG 2.5.3 Label in Name. Validates accessible name contains visible label text.",
    inputSchema: {
      type: "object",
      properties: {
        visibleLabel: { type: "string", description: "The visible label text" },
        accessibleName: { type: "string", description: "The computed accessible name" },
      },
      required: ["visibleLabel", "accessibleName"],
    },
  },
  {
    name: "get_wcag_aria_criteria",
    description: "Get reference information for all WCAG 2.1 ARIA-related success criteria.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
