import type { ToolDefinition } from "@wcag-mcp/core";

export const TEXT_TOOLS: ToolDefinition[] = [
  {
    name: "check_contrast",
    description: "Check WCAG color contrast ratio. Returns pass/fail for AA (1.4.3) and AAA (1.4.6) with human and machine-readable output.",
    inputSchema: {
      type: "object",
      properties: {
        foreground: { type: "string", description: "Text color (hex, rgb, hsl, or named)" },
        background: { type: "string", description: "Background color" },
        fontSize: { type: "number", description: "Font size in pixels (default 16)" },
        isBold: { type: "boolean", description: "Whether text is bold (affects large text threshold)" },
      },
      required: ["foreground", "background"],
    },
  },
  {
    name: "check_text_spacing",
    description: "Validate text spacing against WCAG 1.4.12. Checks line-height, letter/word/paragraph spacing.",
    inputSchema: {
      type: "object",
      properties: {
        fontSize: { type: "number", description: "Font size in pixels" },
        lineHeight: { type: "number", description: "Line height in pixels (should be ≥1.5× font size)" },
        letterSpacing: { type: "number", description: "Letter spacing in pixels (should be ≥0.12× font size)" },
        wordSpacing: { type: "number", description: "Word spacing in pixels (should be ≥0.16× font size)" },
        paragraphSpacing: { type: "number", description: "Paragraph spacing in pixels (should be ≥2× font size)" },
      },
      required: ["fontSize"],
    },
  },
  {
    name: "check_line_length",
    description: "Check text line length against WCAG 1.4.8 (max 80 characters for AAA).",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text to check" },
      },
      required: ["text"],
    },
  },
  {
    name: "check_language",
    description: "Check WCAG 3.1.1 Language of Page requirement.",
    inputSchema: {
      type: "object",
      properties: {
        hasLangAttribute: { type: "boolean", description: "Whether html element has lang attribute" },
        langValue: { type: "string", description: "Value of lang attribute" },
      },
      required: ["hasLangAttribute"],
    },
  },
  {
    name: "validate_text",
    description: "Comprehensive WCAG text validation. Checks all text-related criteria with human and machine-readable report.",
    inputSchema: {
      type: "object",
      properties: {
        foreground: { type: "string", description: "Text color" },
        background: { type: "string", description: "Background color" },
        fontSize: { type: "number", description: "Font size in pixels" },
        isBold: { type: "boolean", description: "Whether text is bold" },
        lineHeight: { type: "number", description: "Line height in pixels" },
        letterSpacing: { type: "number", description: "Letter spacing in pixels" },
        wordSpacing: { type: "number", description: "Word spacing in pixels" },
        paragraphSpacing: { type: "number", description: "Paragraph spacing in pixels" },
        sampleText: { type: "string", description: "Sample text to check line length" },
        isJustified: { type: "boolean", description: "Whether text is fully justified" },
        usesRelativeUnits: { type: "boolean", description: "Whether font uses relative units (em, rem, %)" },
        hasFixedContainers: { type: "boolean", description: "Whether layout uses fixed-width containers" },
        hasLangAttribute: { type: "boolean", description: "Whether html has lang attribute" },
        langValue: { type: "string", description: "Value of lang attribute" },
        hasImagesOfText: { type: "boolean", description: "Whether page contains images of text" },
        imagesAreEssential: { type: "boolean", description: "Whether images of text are essential (logos)" },
      },
      required: ["foreground", "background", "fontSize"],
    },
  },
  {
    name: "get_wcag_text_criteria",
    description: "Get reference information for all WCAG 2.1 text-related success criteria.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
