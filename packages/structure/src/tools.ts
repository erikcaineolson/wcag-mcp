import type { ToolDefinition } from "@wcag-mcp/core";

export const STRUCTURE_TOOLS: ToolDefinition[] = [
  {
    name: "check_heading_structure",
    description: "Check WCAG 1.3.1, 2.4.6, 2.4.10 heading requirements. Validates heading hierarchy and organization.",
    inputSchema: {
      type: "object",
      properties: {
        headings: {
          type: "array",
          description: "All headings on the page in order",
          items: {
            type: "object",
            properties: {
              level: { type: "number", description: "Heading level (1-6)" },
              text: { type: "string", description: "Heading text" },
            },
            required: ["level", "text"],
          },
        },
        hasH1: { type: "boolean", description: "Whether page has h1" },
        h1Count: { type: "number", description: "Number of h1s on page" },
      },
      required: ["headings"],
    },
  },
  {
    name: "check_page_title",
    description: "Check WCAG 2.4.2 Page Titled. Validates page has descriptive title.",
    inputSchema: {
      type: "object",
      properties: {
        hasTitle: { type: "boolean", description: "Whether page has title" },
        titleText: { type: "string", description: "Title text" },
        isDescriptive: { type: "boolean", description: "Whether title is descriptive" },
        identifiesSite: { type: "boolean", description: "Whether title identifies site/app" },
      },
      required: ["hasTitle"],
    },
  },
  {
    name: "check_link_purpose",
    description: "Check WCAG 2.4.4 and 2.4.9 Link Purpose. Validates link text is descriptive.",
    inputSchema: {
      type: "object",
      properties: {
        linkText: { type: "string", description: "Link text" },
        isDescriptive: { type: "boolean", description: "Whether link text is descriptive" },
        hasContext: { type: "boolean", description: "Whether link has clarifying context" },
        contextText: { type: "string", description: "Surrounding context text" },
        destinationType: {
          type: "string",
          enum: ["same-page", "new-page", "download", "external"],
          description: "Link destination type",
        },
        opensNewWindow: { type: "boolean", description: "Whether link opens new window" },
        newWindowIndicated: { type: "boolean", description: "Whether new window is indicated" },
      },
      required: ["linkText"],
    },
  },
  {
    name: "check_bypass_blocks",
    description: "Check WCAG 2.4.1 Bypass Blocks. Validates skip links, landmarks, or heading structure.",
    inputSchema: {
      type: "object",
      properties: {
        hasSkipLink: { type: "boolean", description: "Whether skip link exists" },
        skipLinkTarget: { type: "string", description: "Skip link target" },
        hasLandmarks: { type: "boolean", description: "Whether ARIA landmarks are used" },
        hasHeadingStructure: { type: "boolean", description: "Whether headings provide structure" },
        landmarks: {
          type: "array",
          items: { type: "string" },
          description: "ARIA landmarks present",
        },
      },
      required: ["hasSkipLink"],
    },
  },
  {
    name: "check_reading_order",
    description: "Check WCAG 1.3.2 Meaningful Sequence. Validates visual order matches DOM order.",
    inputSchema: {
      type: "object",
      properties: {
        visualMatchesDom: { type: "boolean", description: "Whether visual order matches DOM" },
        hasCssReordering: { type: "boolean", description: "Whether CSS reordering is used" },
        reorderedElements: {
          type: "array",
          items: { type: "string" },
          description: "Elements with CSS order/flex-order",
        },
        hasPositiveTabindex: { type: "boolean", description: "Whether tabindex > 0 is used" },
      },
      required: ["visualMatchesDom"],
    },
  },
  {
    name: "check_info_relationships",
    description: "Check WCAG 1.3.1 Info and Relationships. Validates structure is programmatically determinable.",
    inputSchema: {
      type: "object",
      properties: {
        elementType: { type: "string", description: "Element type being checked" },
        isProgrammatic: { type: "boolean", description: "Whether relationships are programmatic" },
        usesSemanticHtml: { type: "boolean", description: "Whether using semantic HTML" },
        ariaAttributes: {
          type: "array",
          items: { type: "string" },
          description: "ARIA attributes used",
        },
        issues: {
          type: "array",
          items: { type: "string" },
          description: "Issues found",
        },
      },
      required: ["elementType", "isProgrammatic"],
    },
  },
  {
    name: "check_multiple_ways",
    description: "Check WCAG 2.4.5 Multiple Ways. Validates multiple navigation methods exist.",
    inputSchema: {
      type: "object",
      properties: {
        navigationMethods: {
          type: "object",
          description: "Navigation methods available",
          properties: {
            siteMap: { type: "boolean" },
            search: { type: "boolean" },
            tableOfContents: { type: "boolean" },
            navigation: { type: "boolean" },
            relatedLinks: { type: "boolean" },
            breadcrumbs: { type: "boolean" },
          },
        },
        isProcessStep: { type: "boolean", description: "Whether page is part of a process" },
      },
      required: ["navigationMethods"],
    },
  },
  {
    name: "check_consistent_navigation",
    description: "Check WCAG 3.2.3 Consistent Navigation. Validates navigation order is consistent.",
    inputSchema: {
      type: "object",
      properties: {
        navigationElements: {
          type: "array",
          description: "Navigation from multiple pages",
          items: {
            type: "object",
            properties: {
              page: { type: "string", description: "Page identifier" },
              order: {
                type: "array",
                items: { type: "string" },
                description: "Navigation items in order",
              },
            },
            required: ["page", "order"],
          },
        },
      },
      required: ["navigationElements"],
    },
  },
  {
    name: "check_consistent_identification",
    description: "Check WCAG 3.2.4 Consistent Identification. Validates same-function components are labeled consistently.",
    inputSchema: {
      type: "object",
      properties: {
        components: {
          type: "array",
          description: "Components grouped by function",
          items: {
            type: "object",
            properties: {
              function: { type: "string", description: "Component function (search, submit, etc.)" },
              identifiers: {
                type: "array",
                items: { type: "string" },
                description: "Labels/names used for this function",
              },
            },
            required: ["function", "identifiers"],
          },
        },
      },
      required: ["components"],
    },
  },
  {
    name: "get_wcag_structure_criteria",
    description: "Get reference information for all WCAG 2.1 structure-related success criteria.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
