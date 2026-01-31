#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { parse, wcagContrast, formatHex } from "culori";

// =============================================================================
// WCAG 2.1 Text Criteria Reference
// =============================================================================

const WCAG_CRITERIA = {
  "1.4.3": {
    id: "1.4.3",
    name: "Contrast (Minimum)",
    level: "AA",
    description: "Text has a contrast ratio of at least 4.5:1 (3:1 for large text)",
    url: "https://www.w3.org/TR/WCAG21/#contrast-minimum",
  },
  "1.4.6": {
    id: "1.4.6",
    name: "Contrast (Enhanced)",
    level: "AAA",
    description: "Text has a contrast ratio of at least 7:1 (4.5:1 for large text)",
    url: "https://www.w3.org/TR/WCAG21/#contrast-enhanced",
  },
  "1.4.4": {
    id: "1.4.4",
    name: "Resize Text",
    level: "AA",
    description: "Text can be resized up to 200% without loss of content or functionality",
    url: "https://www.w3.org/TR/WCAG21/#resize-text",
  },
  "1.4.5": {
    id: "1.4.5",
    name: "Images of Text",
    level: "AA",
    description: "Use text rather than images of text (except for customizable or essential)",
    url: "https://www.w3.org/TR/WCAG21/#images-of-text",
  },
  "1.4.8": {
    id: "1.4.8",
    name: "Visual Presentation",
    level: "AAA",
    description: "Text blocks: select colors, max 80 chars/line, no justify, adequate spacing, 200% resize",
    url: "https://www.w3.org/TR/WCAG21/#visual-presentation",
  },
  "1.4.9": {
    id: "1.4.9",
    name: "Images of Text (No Exception)",
    level: "AAA",
    description: "Images of text only used for pure decoration or where essential",
    url: "https://www.w3.org/TR/WCAG21/#images-of-text-no-exception",
  },
  "1.4.10": {
    id: "1.4.10",
    name: "Reflow",
    level: "AA",
    description: "Content reflows at 400% zoom without horizontal scrolling (320px viewport)",
    url: "https://www.w3.org/TR/WCAG21/#reflow",
  },
  "1.4.12": {
    id: "1.4.12",
    name: "Text Spacing",
    level: "AA",
    description: "No loss of content when: line-height 1.5x, paragraph spacing 2x, letter spacing 0.12x, word spacing 0.16x",
    url: "https://www.w3.org/TR/WCAG21/#text-spacing",
  },
  "3.1.1": {
    id: "3.1.1",
    name: "Language of Page",
    level: "A",
    description: "Default language of the page can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#language-of-page",
  },
  "3.1.2": {
    id: "3.1.2",
    name: "Language of Parts",
    level: "AA",
    description: "Language of passages/phrases can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#language-of-parts",
  },
};

const REQUIREMENTS = {
  contrast: {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  },
  textSpacing: {
    lineHeight: 1.5,
    paragraphSpacing: 2,
    letterSpacing: 0.12,
    wordSpacing: 0.16,
  },
  lineLength: {
    maxChars: 80,
  },
  largeText: {
    normalPx: 24,   // 18pt
    boldPx: 18.66,  // 14pt bold
  },
  reflow: {
    minViewportWidth: 320,
  },
};

// =============================================================================
// Types
// =============================================================================

type WcagLevel = "A" | "AA" | "AAA";
type CheckStatus = "pass" | "fail" | "warning" | "info";

interface CheckResult {
  criterion: string;
  name: string;
  level: WcagLevel;
  status: CheckStatus;
  value?: string | number | boolean;
  required?: string | number;
  message: string;
  recommendation?: string;
}

interface ValidationReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    levelA: { passed: number; failed: number };
    levelAA: { passed: number; failed: number };
    levelAAA: { passed: number; failed: number };
  };
  results: CheckResult[];
  human: string;
  machine: object;
}

// =============================================================================
// Formatting Helpers
// =============================================================================

function formatHumanReport(results: CheckResult[]): string {
  const lines: string[] = [];

  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push("                    WCAG TEXT ACCESSIBILITY REPORT              ");
  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push("");

  const passed = results.filter(r => r.status === "pass");
  const failed = results.filter(r => r.status === "fail");
  const warnings = results.filter(r => r.status === "warning");

  // Summary
  lines.push(`SUMMARY: ${passed.length} passed, ${failed.length} failed, ${warnings.length} warnings`);
  lines.push("");

  // Failures first
  if (failed.length > 0) {
    lines.push("❌ FAILURES");
    lines.push("───────────────────────────────────────────────────────────────");
    for (const r of failed) {
      lines.push(`[${r.criterion}] ${r.name} (Level ${r.level})`);
      lines.push(`   ${r.message}`);
      if (r.recommendation) {
        lines.push(`   → ${r.recommendation}`);
      }
      lines.push("");
    }
  }

  // Warnings
  if (warnings.length > 0) {
    lines.push("⚠️  WARNINGS");
    lines.push("───────────────────────────────────────────────────────────────");
    for (const r of warnings) {
      lines.push(`[${r.criterion}] ${r.name} (Level ${r.level})`);
      lines.push(`   ${r.message}`);
      if (r.recommendation) {
        lines.push(`   → ${r.recommendation}`);
      }
      lines.push("");
    }
  }

  // Passes
  if (passed.length > 0) {
    lines.push("✅ PASSED");
    lines.push("───────────────────────────────────────────────────────────────");
    for (const r of passed) {
      lines.push(`[${r.criterion}] ${r.name} (Level ${r.level}): ${r.message}`);
    }
    lines.push("");
  }

  lines.push("═══════════════════════════════════════════════════════════════");

  return lines.join("\n");
}

function createReport(results: CheckResult[]): ValidationReport {
  const passed = results.filter(r => r.status === "pass");
  const failed = results.filter(r => r.status === "fail");
  const warnings = results.filter(r => r.status === "warning");

  const byLevel = (level: WcagLevel) => ({
    passed: results.filter(r => r.level === level && r.status === "pass").length,
    failed: results.filter(r => r.level === level && r.status === "fail").length,
  });

  return {
    summary: {
      total: results.length,
      passed: passed.length,
      failed: failed.length,
      warnings: warnings.length,
      levelA: byLevel("A"),
      levelAA: byLevel("AA"),
      levelAAA: byLevel("AAA"),
    },
    results,
    human: formatHumanReport(results),
    machine: {
      wcagVersion: "2.1",
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: passed.length,
        failed: failed.length,
        warnings: warnings.length,
      },
      results: results.map(r => ({
        criterion: r.criterion,
        name: r.name,
        level: r.level,
        status: r.status,
        value: r.value,
        required: r.required,
        message: r.message,
        recommendation: r.recommendation,
        url: WCAG_CRITERIA[r.criterion as keyof typeof WCAG_CRITERIA]?.url,
      })),
    },
  };
}

// =============================================================================
// Check Functions
// =============================================================================

function isLargeText(sizePx: number, isBold: boolean): boolean {
  return sizePx >= REQUIREMENTS.largeText.normalPx ||
    (isBold && sizePx >= REQUIREMENTS.largeText.boldPx);
}

function checkContrastRatio(
  foreground: string,
  background: string,
  sizePx: number,
  isBold: boolean = false
): CheckResult[] {
  const results: CheckResult[] = [];
  const fg = parse(foreground);
  const bg = parse(background);

  if (!fg || !bg) {
    return [{
      criterion: "1.4.3",
      name: "Contrast (Minimum)",
      level: "AA",
      status: "fail",
      message: `Invalid color: ${!fg ? foreground : background}`,
    }];
  }

  const ratio = Math.round(wcagContrast(fg, bg) * 100) / 100;
  const large = isLargeText(sizePx, isBold);
  const textType = large ? "large" : "normal";

  // AA check (1.4.3)
  const aaRequired = large ? REQUIREMENTS.contrast.AA.large : REQUIREMENTS.contrast.AA.normal;
  const aaPasses = ratio >= aaRequired;
  results.push({
    criterion: "1.4.3",
    name: "Contrast (Minimum)",
    level: "AA",
    status: aaPasses ? "pass" : "fail",
    value: ratio,
    required: aaRequired,
    message: aaPasses
      ? `Contrast ratio ${ratio}:1 meets AA requirement (${aaRequired}:1 for ${textType} text)`
      : `Contrast ratio ${ratio}:1 fails AA requirement (${aaRequired}:1 for ${textType} text)`,
    recommendation: aaPasses ? undefined : `Increase contrast to at least ${aaRequired}:1`,
  });

  // AAA check (1.4.6)
  const aaaRequired = large ? REQUIREMENTS.contrast.AAA.large : REQUIREMENTS.contrast.AAA.normal;
  const aaaPasses = ratio >= aaaRequired;
  results.push({
    criterion: "1.4.6",
    name: "Contrast (Enhanced)",
    level: "AAA",
    status: aaaPasses ? "pass" : (aaPasses ? "warning" : "fail"),
    value: ratio,
    required: aaaRequired,
    message: aaaPasses
      ? `Contrast ratio ${ratio}:1 meets AAA requirement (${aaaRequired}:1 for ${textType} text)`
      : `Contrast ratio ${ratio}:1 does not meet AAA requirement (${aaaRequired}:1 for ${textType} text)`,
    recommendation: aaaPasses ? undefined : `Increase contrast to at least ${aaaRequired}:1 for enhanced accessibility`,
  });

  return results;
}

function checkTextSpacing(
  fontSize: number,
  lineHeight?: number,
  letterSpacing?: number,
  wordSpacing?: number,
  paragraphSpacing?: number
): CheckResult[] {
  const results: CheckResult[] = [];
  const req = REQUIREMENTS.textSpacing;

  const checks: Array<{
    name: string;
    value?: number;
    multiplier: number;
    label: string;
  }> = [
    { name: "lineHeight", value: lineHeight, multiplier: req.lineHeight, label: "Line height" },
    { name: "letterSpacing", value: letterSpacing, multiplier: req.letterSpacing, label: "Letter spacing" },
    { name: "wordSpacing", value: wordSpacing, multiplier: req.wordSpacing, label: "Word spacing" },
    { name: "paragraphSpacing", value: paragraphSpacing, multiplier: req.paragraphSpacing, label: "Paragraph spacing" },
  ];

  const testedChecks = checks.filter(c => c.value !== undefined);

  if (testedChecks.length === 0) {
    results.push({
      criterion: "1.4.12",
      name: "Text Spacing",
      level: "AA",
      status: "info",
      message: "No spacing values provided to check. Ensure content adapts to user-defined spacing.",
    });
    return results;
  }

  let allPass = true;
  const details: string[] = [];

  for (const check of testedChecks) {
    const required = fontSize * check.multiplier;
    const passes = check.value! >= required;
    if (!passes) allPass = false;
    details.push(
      `${check.label}: ${check.value}px ${passes ? "≥" : "<"} ${required.toFixed(1)}px (${check.multiplier}× font size) ${passes ? "✓" : "✗"}`
    );
  }

  results.push({
    criterion: "1.4.12",
    name: "Text Spacing",
    level: "AA",
    status: allPass ? "pass" : "fail",
    message: allPass
      ? `Text spacing supports WCAG requirements:\n   ${details.join("\n   ")}`
      : `Text spacing fails WCAG requirements:\n   ${details.join("\n   ")}`,
    recommendation: allPass ? undefined : "Ensure text remains readable when users apply custom spacing styles",
  });

  return results;
}

function checkLineLength(text: string): CheckResult[] {
  const lines = text.split("\n");
  const lengths = lines.map(l => l.length);
  const longest = Math.max(...lengths);
  const maxAllowed = REQUIREMENTS.lineLength.maxChars;
  const passes = longest <= maxAllowed;

  return [{
    criterion: "1.4.8",
    name: "Visual Presentation (Line Length)",
    level: "AAA",
    status: passes ? "pass" : "warning",
    value: longest,
    required: maxAllowed,
    message: passes
      ? `Longest line is ${longest} characters (max ${maxAllowed} for AAA)`
      : `Longest line is ${longest} characters, exceeds ${maxAllowed} character recommendation`,
    recommendation: passes ? undefined : "Consider breaking long lines to improve readability",
  }];
}

function checkTextJustification(isJustified: boolean): CheckResult[] {
  return [{
    criterion: "1.4.8",
    name: "Visual Presentation (Justification)",
    level: "AAA",
    status: isJustified ? "fail" : "pass",
    value: isJustified,
    message: isJustified
      ? "Text is fully justified, which can create uneven spacing"
      : "Text is not fully justified",
    recommendation: isJustified ? "Use left, right, or center alignment instead of full justification" : undefined,
  }];
}

function checkResizeText(
  usesRelativeUnits: boolean,
  hasFixedContainers: boolean
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!usesRelativeUnits) {
    results.push({
      criterion: "1.4.4",
      name: "Resize Text",
      level: "AA",
      status: "warning",
      value: usesRelativeUnits,
      message: "Text may not use relative units (em, rem, %)",
      recommendation: "Use relative units for font sizes to allow proper scaling",
    });
  } else {
    results.push({
      criterion: "1.4.4",
      name: "Resize Text",
      level: "AA",
      status: "pass",
      message: "Text uses relative units for proper scaling",
    });
  }

  if (hasFixedContainers) {
    results.push({
      criterion: "1.4.10",
      name: "Reflow",
      level: "AA",
      status: "warning",
      message: "Fixed-width containers may prevent content reflow at high zoom levels",
      recommendation: "Use responsive layouts that adapt to viewport changes",
    });
  }

  return results;
}

function checkLanguage(hasLangAttribute: boolean, langValue?: string): CheckResult[] {
  const results: CheckResult[] = [];

  if (!hasLangAttribute) {
    results.push({
      criterion: "3.1.1",
      name: "Language of Page",
      level: "A",
      status: "fail",
      message: "Page is missing lang attribute on html element",
      recommendation: "Add lang attribute to html element (e.g., <html lang=\"en\">)",
    });
  } else if (!langValue || langValue.length < 2) {
    results.push({
      criterion: "3.1.1",
      name: "Language of Page",
      level: "A",
      status: "fail",
      value: langValue,
      message: `Invalid lang attribute value: "${langValue}"`,
      recommendation: "Use valid BCP 47 language tag (e.g., \"en\", \"en-US\", \"es\")",
    });
  } else {
    results.push({
      criterion: "3.1.1",
      name: "Language of Page",
      level: "A",
      status: "pass",
      value: langValue,
      message: `Page language is set to "${langValue}"`,
    });
  }

  return results;
}

function checkImagesOfText(hasImagesOfText: boolean, isEssential: boolean = false): CheckResult[] {
  if (!hasImagesOfText) {
    return [{
      criterion: "1.4.5",
      name: "Images of Text",
      level: "AA",
      status: "pass",
      message: "No images of text detected",
    }];
  }

  if (isEssential) {
    return [{
      criterion: "1.4.5",
      name: "Images of Text",
      level: "AA",
      status: "pass",
      message: "Images of text are marked as essential (logos, etc.)",
    }];
  }

  return [{
    criterion: "1.4.5",
    name: "Images of Text",
    level: "AA",
    status: "fail",
    message: "Images of text should be replaced with actual text",
    recommendation: "Use CSS for visual styling instead of text in images",
  }];
}

// =============================================================================
// Main Validation Function
// =============================================================================

interface FullValidationInput {
  foreground: string;
  background: string;
  fontSize: number;
  isBold?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  wordSpacing?: number;
  paragraphSpacing?: number;
  sampleText?: string;
  isJustified?: boolean;
  usesRelativeUnits?: boolean;
  hasFixedContainers?: boolean;
  hasLangAttribute?: boolean;
  langValue?: string;
  hasImagesOfText?: boolean;
  imagesAreEssential?: boolean;
}

function validateAll(input: FullValidationInput): ValidationReport {
  const results: CheckResult[] = [];

  // Contrast checks (1.4.3, 1.4.6)
  results.push(...checkContrastRatio(
    input.foreground,
    input.background,
    input.fontSize,
    input.isBold
  ));

  // Text spacing check (1.4.12)
  results.push(...checkTextSpacing(
    input.fontSize,
    input.lineHeight,
    input.letterSpacing,
    input.wordSpacing,
    input.paragraphSpacing
  ));

  // Line length check (1.4.8)
  if (input.sampleText) {
    results.push(...checkLineLength(input.sampleText));
  }

  // Justification check (1.4.8)
  if (input.isJustified !== undefined) {
    results.push(...checkTextJustification(input.isJustified));
  }

  // Resize/Reflow checks (1.4.4, 1.4.10)
  if (input.usesRelativeUnits !== undefined || input.hasFixedContainers !== undefined) {
    results.push(...checkResizeText(
      input.usesRelativeUnits ?? true,
      input.hasFixedContainers ?? false
    ));
  }

  // Language check (3.1.1)
  if (input.hasLangAttribute !== undefined) {
    results.push(...checkLanguage(input.hasLangAttribute, input.langValue));
  }

  // Images of text check (1.4.5)
  if (input.hasImagesOfText !== undefined) {
    results.push(...checkImagesOfText(input.hasImagesOfText, input.imagesAreEssential));
  }

  return createReport(results);
}

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  { name: "wcag-text-mcp", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
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
  ],
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
        const report = createReport(results);
        return {
          content: [
            { type: "text", text: report.human },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(report.machine, null, 2) },
          ],
        };
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
        const report = createReport(results);
        return {
          content: [
            { type: "text", text: report.human },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(report.machine, null, 2) },
          ],
        };
      }

      case "check_line_length": {
        const { text } = args as { text: string };
        const results = checkLineLength(text);
        const report = createReport(results);
        return {
          content: [
            { type: "text", text: report.human },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(report.machine, null, 2) },
          ],
        };
      }

      case "check_language": {
        const { hasLangAttribute, langValue } = args as { hasLangAttribute: boolean; langValue?: string };
        const results = checkLanguage(hasLangAttribute, langValue);
        const report = createReport(results);
        return {
          content: [
            { type: "text", text: report.human },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(report.machine, null, 2) },
          ],
        };
      }

      case "validate_text": {
        const report = validateAll(args as unknown as FullValidationInput);
        return {
          content: [
            { type: "text", text: report.human },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(report.machine, null, 2) },
          ],
        };
      }

      case "get_wcag_text_criteria": {
        const formatted = Object.values(WCAG_CRITERIA)
          .map(c => `[${c.id}] ${c.name} (Level ${c.level})\n   ${c.description}\n   ${c.url}`)
          .join("\n\n");
        return {
          content: [
            { type: "text", text: "WCAG 2.1 Text-Related Success Criteria\n\n" + formatted },
            { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(WCAG_CRITERIA, null, 2) },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WCAG Text MCP server v2.0.0 running on stdio");
}

main().catch(console.error);
