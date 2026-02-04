import type { CheckResult } from "@wcag-mcp/core";
import { parse, wcagContrast } from "culori";

// =============================================================================
// Constants
// =============================================================================

export const REQUIREMENTS = {
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
// Check Functions
// =============================================================================

function isLargeText(sizePx: number, isBold: boolean): boolean {
  return sizePx >= REQUIREMENTS.largeText.normalPx ||
    (isBold && sizePx >= REQUIREMENTS.largeText.boldPx);
}

export function checkContrastRatio(
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

export function checkTextSpacing(
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

export function checkLineLength(text: string): CheckResult[] {
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

export function checkTextJustification(isJustified: boolean): CheckResult[] {
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

export function checkResizeText(
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

export function checkLanguage(hasLangAttribute: boolean, langValue?: string): CheckResult[] {
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

export function checkImagesOfText(hasImagesOfText: boolean, isEssential: boolean = false): CheckResult[] {
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
// Full Validation
// =============================================================================

export interface FullValidationInput {
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

export function validateAll(input: FullValidationInput): CheckResult[] {
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

  return results;
}
