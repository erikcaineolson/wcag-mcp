import type { CheckResult } from "@wcag-mcp/core";

// =============================================================================
// Types
// =============================================================================

export interface HeadingInput {
  /** Heading level (1-6) */
  level: number;
  /** Heading text */
  text: string;
  /** Is this the first heading? */
  isFirst?: boolean;
  /** Previous heading level */
  previousLevel?: number;
}

export interface HeadingStructureInput {
  /** All headings on the page in order */
  headings: HeadingInput[];
  /** Whether page has h1 */
  hasH1?: boolean;
  /** Number of h1s on page */
  h1Count?: number;
}

export interface PageTitleInput {
  /** Whether page has title */
  hasTitle: boolean;
  /** Title text */
  titleText?: string;
  /** Whether title is descriptive */
  isDescriptive?: boolean;
  /** Whether title identifies site/app */
  identifiesSite?: boolean;
}

export interface LinkInput {
  /** Link text */
  linkText: string;
  /** Whether link text is descriptive */
  isDescriptive?: boolean;
  /** Whether link has additional context */
  hasContext?: boolean;
  /** Context text (surrounding paragraph, list item, etc.) */
  contextText?: string;
  /** Link destination type */
  destinationType?: "same-page" | "new-page" | "download" | "external";
  /** Whether link opens in new window */
  opensNewWindow?: boolean;
  /** Whether new window is indicated */
  newWindowIndicated?: boolean;
}

export interface BypassBlocksInput {
  /** Whether skip link exists */
  hasSkipLink: boolean;
  /** Skip link target */
  skipLinkTarget?: string;
  /** Whether landmarks are used */
  hasLandmarks?: boolean;
  /** Whether headings provide structure */
  hasHeadingStructure?: boolean;
  /** ARIA landmarks present */
  landmarks?: string[];
}

export interface ReadingOrderInput {
  /** Whether visual order matches DOM order */
  visualMatchesDom: boolean;
  /** Whether CSS reordering is used */
  hasCssReordering?: boolean;
  /** Elements with CSS order/flex-order */
  reorderedElements?: string[];
  /** Whether tabindex > 0 is used */
  hasPositiveTabindex?: boolean;
}

export interface InfoRelationshipsInput {
  /** Element type being checked */
  elementType: string;
  /** Whether relationships are programmatically determinable */
  isProgrammatic: boolean;
  /** Whether using semantic HTML */
  usesSemanticHtml?: boolean;
  /** ARIA attributes used */
  ariaAttributes?: string[];
  /** Issues found */
  issues?: string[];
}

export interface MultipleWaysInput {
  /** Navigation methods available */
  navigationMethods: {
    siteMap?: boolean;
    search?: boolean;
    tableOfContents?: boolean;
    navigation?: boolean;
    relatedLinks?: boolean;
    breadcrumbs?: boolean;
  };
  /** Whether page is part of a process (exemption applies) */
  isProcessStep?: boolean;
}

// =============================================================================
// Check Functions
// =============================================================================

export function checkHeadingStructure(input: HeadingStructureInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (input.headings.length === 0) {
    results.push({
      criterion: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      status: "warning",
      message: "Page has no headings",
      recommendation: "Use heading elements (h1-h6) to identify sections of content",
    });
    return results;
  }

  // 2.4.6 Headings and Labels (Level AA) - descriptive headings
  results.push({
    criterion: "2.4.6",
    name: "Headings and Labels",
    level: "AA",
    status: "info",
    message: `Page has ${input.headings.length} heading(s)`,
  });

  // Check for h1
  const h1Count = input.h1Count ?? input.headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    results.push({
      criterion: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      status: "warning",
      message: "Page lacks h1 heading",
      recommendation: "Add a main h1 heading that describes the page content",
    });
  } else if (h1Count > 1) {
    results.push({
      criterion: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      status: "warning",
      value: h1Count,
      message: `Page has ${h1Count} h1 headings`,
      recommendation: "Consider using single h1 for main content; multiple h1s can confuse navigation",
    });
  }

  // Check heading level skipping
  const skippedLevels: string[] = [];
  for (let i = 1; i < input.headings.length; i++) {
    const current = input.headings[i];
    const previous = input.headings[i - 1];
    const diff = current.level - previous.level;

    // Skipping levels when going deeper (e.g., h2 to h4)
    if (diff > 1) {
      skippedLevels.push(`h${previous.level} → h${current.level} ("${current.text}")`);
    }
  }

  if (skippedLevels.length > 0) {
    results.push({
      criterion: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      status: "warning",
      message: `Heading levels skipped: ${skippedLevels.join("; ")}`,
      recommendation: "Use heading levels in order (h1, h2, h3...) without skipping levels",
    });
  } else {
    results.push({
      criterion: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      status: "pass",
      message: "Heading levels follow logical sequence",
    });
  }

  // 2.4.10 Section Headings (Level AAA)
  results.push({
    criterion: "2.4.10",
    name: "Section Headings",
    level: "AAA",
    status: input.headings.length >= 2 ? "pass" : "warning",
    message: input.headings.length >= 2
      ? "Section headings are used to organize content"
      : "Consider adding more section headings for AAA compliance",
  });

  return results;
}

export function checkPageTitle(input: PageTitleInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 2.4.2 Page Titled (Level A)
  if (!input.hasTitle) {
    results.push({
      criterion: "2.4.2",
      name: "Page Titled",
      level: "A",
      status: "fail",
      message: "Page lacks a title",
      recommendation: "Add a <title> element to the page head",
    });
    return results;
  }

  if (!input.titleText || input.titleText.trim().length === 0) {
    results.push({
      criterion: "2.4.2",
      name: "Page Titled",
      level: "A",
      status: "fail",
      value: "(empty)",
      message: "Page title is empty",
      recommendation: "Provide a descriptive title that identifies the page content",
    });
    return results;
  }

  // Check if title is descriptive
  const genericTitles = ["untitled", "home", "page", "document", "welcome"];
  const isGeneric = genericTitles.includes(input.titleText.toLowerCase().trim());

  if (isGeneric || input.isDescriptive === false) {
    results.push({
      criterion: "2.4.2",
      name: "Page Titled",
      level: "A",
      status: "warning",
      value: input.titleText,
      message: `Page title "${input.titleText}" may not be descriptive`,
      recommendation: "Title should describe the page topic or purpose",
    });
  } else {
    results.push({
      criterion: "2.4.2",
      name: "Page Titled",
      level: "A",
      status: "pass",
      value: input.titleText,
      message: `Page has title: "${input.titleText}"`,
    });
  }

  return results;
}

export function checkLinkPurpose(input: LinkInput): CheckResult[] {
  const results: CheckResult[] = [];

  // Check for generic link text
  const genericTexts = ["click here", "read more", "learn more", "here", "more", "link", "this"];
  const isGeneric = genericTexts.includes(input.linkText.toLowerCase().trim());

  // 2.4.4 Link Purpose (In Context) - Level A
  const hasPurposeInContext = input.isDescriptive || (isGeneric && input.hasContext);

  results.push({
    criterion: "2.4.4",
    name: "Link Purpose (In Context)",
    level: "A",
    status: hasPurposeInContext ? "pass" : "fail",
    value: input.linkText,
    message: hasPurposeInContext
      ? `Link purpose clear: "${input.linkText}"${input.hasContext ? " (with context)" : ""}`
      : `Link text "${input.linkText}" doesn't clearly indicate purpose`,
    recommendation: hasPurposeInContext
      ? undefined
      : "Use descriptive link text or ensure surrounding context clarifies purpose",
  });

  // 2.4.9 Link Purpose (Link Only) - Level AAA
  results.push({
    criterion: "2.4.9",
    name: "Link Purpose (Link Only)",
    level: "AAA",
    status: input.isDescriptive && !isGeneric ? "pass" : "warning",
    value: input.linkText,
    message: input.isDescriptive && !isGeneric
      ? "Link text alone describes purpose (meets AAA)"
      : `Consider making link text "${input.linkText}" self-describing for AAA`,
    recommendation: input.isDescriptive && !isGeneric
      ? undefined
      : "Link text should describe destination without needing surrounding context",
  });

  // Check new window indication
  if (input.opensNewWindow && !input.newWindowIndicated) {
    results.push({
      criterion: "2.4.4",
      name: "Link Purpose (In Context)",
      level: "A",
      status: "warning",
      message: "Link opens in new window but this is not indicated",
      recommendation: "Indicate new window behavior (e.g., 'opens in new tab' in link text or title)",
    });
  }

  return results;
}

export function checkBypassBlocks(input: BypassBlocksInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 2.4.1 Bypass Blocks (Level A)
  const hasBypassMechanism = input.hasSkipLink || input.hasLandmarks || input.hasHeadingStructure;

  if (!hasBypassMechanism) {
    results.push({
      criterion: "2.4.1",
      name: "Bypass Blocks",
      level: "A",
      status: "fail",
      message: "No mechanism to bypass repeated content blocks",
      recommendation: "Add skip link, use ARIA landmarks, or provide heading structure",
    });
    return results;
  }

  const mechanisms = [
    input.hasSkipLink && "skip link",
    input.hasLandmarks && "ARIA landmarks",
    input.hasHeadingStructure && "heading structure",
  ].filter(Boolean);

  results.push({
    criterion: "2.4.1",
    name: "Bypass Blocks",
    level: "A",
    status: "pass",
    message: `Bypass mechanism(s): ${mechanisms.join(", ")}`,
  });

  // Check skip link specifics
  if (input.hasSkipLink) {
    if (!input.skipLinkTarget) {
      results.push({
        criterion: "2.4.1",
        name: "Bypass Blocks",
        level: "A",
        status: "warning",
        message: "Skip link target not specified",
        recommendation: "Ensure skip link targets main content area",
      });
    }
  }

  // Report landmarks if provided
  if (input.landmarks && input.landmarks.length > 0) {
    results.push({
      criterion: "2.4.1",
      name: "Bypass Blocks",
      level: "A",
      status: "info",
      message: `Landmarks found: ${input.landmarks.join(", ")}`,
    });
  }

  return results;
}

export function checkReadingOrder(input: ReadingOrderInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 1.3.2 Meaningful Sequence (Level A)
  if (!input.visualMatchesDom) {
    results.push({
      criterion: "1.3.2",
      name: "Meaningful Sequence",
      level: "A",
      status: "fail",
      message: "Visual order does not match DOM order",
      recommendation: "Ensure DOM order reflects meaningful reading sequence",
    });
  } else {
    results.push({
      criterion: "1.3.2",
      name: "Meaningful Sequence",
      level: "A",
      status: "pass",
      message: "Visual order matches DOM order",
    });
  }

  // Check CSS reordering
  if (input.hasCssReordering) {
    results.push({
      criterion: "1.3.2",
      name: "Meaningful Sequence",
      level: "A",
      status: "warning",
      message: `CSS reordering detected${input.reorderedElements ? `: ${input.reorderedElements.join(", ")}` : ""}`,
      recommendation: "Verify CSS order/flex-order doesn't break reading sequence for screen readers",
    });
  }

  // Check positive tabindex
  if (input.hasPositiveTabindex) {
    results.push({
      criterion: "2.4.3",
      name: "Focus Order",
      level: "A",
      status: "warning",
      message: "Positive tabindex values found",
      recommendation: "Avoid positive tabindex; use DOM order or tabindex=0",
    });
  }

  return results;
}

export function checkInfoRelationships(input: InfoRelationshipsInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 1.3.1 Info and Relationships (Level A)
  if (!input.isProgrammatic) {
    results.push({
      criterion: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      status: "fail",
      message: `${input.elementType} relationships not programmatically determinable`,
      recommendation: "Use semantic HTML or ARIA to convey structure and relationships",
    });
    return results;
  }

  results.push({
    criterion: "1.3.1",
    name: "Info and Relationships",
    level: "A",
    status: "pass",
    message: `${input.elementType} relationships are programmatically determinable`,
  });

  // Check semantic HTML usage
  if (!input.usesSemanticHtml) {
    results.push({
      criterion: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      status: "warning",
      message: `${input.elementType} uses ARIA but not semantic HTML`,
      recommendation: "Prefer semantic HTML elements over ARIA where possible",
    });
  }

  // Report issues
  if (input.issues && input.issues.length > 0) {
    for (const issue of input.issues) {
      results.push({
        criterion: "1.3.1",
        name: "Info and Relationships",
        level: "A",
        status: "warning",
        message: issue,
      });
    }
  }

  return results;
}

export function checkMultipleWays(input: MultipleWaysInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 2.4.5 Multiple Ways (Level AA)
  // Exemption for pages that are part of a process
  if (input.isProcessStep) {
    results.push({
      criterion: "2.4.5",
      name: "Multiple Ways",
      level: "AA",
      status: "pass",
      message: "Page is part of a process (exemption applies)",
    });
    return results;
  }

  const methods = input.navigationMethods;
  const availableMethods = [
    methods.siteMap && "site map",
    methods.search && "search",
    methods.tableOfContents && "table of contents",
    methods.navigation && "navigation menu",
    methods.relatedLinks && "related links",
    methods.breadcrumbs && "breadcrumbs",
  ].filter(Boolean);

  const hasMultipleWays = availableMethods.length >= 2;

  results.push({
    criterion: "2.4.5",
    name: "Multiple Ways",
    level: "AA",
    status: hasMultipleWays ? "pass" : "fail",
    value: availableMethods.length,
    message: hasMultipleWays
      ? `Multiple ways to locate page: ${availableMethods.join(", ")}`
      : `Only ${availableMethods.length} navigation method(s) found`,
    recommendation: hasMultipleWays
      ? undefined
      : "Provide at least two ways to locate pages (e.g., navigation + search, sitemap + TOC)",
  });

  return results;
}

export function checkConsistentNavigation(input: {
  navigationElements: Array<{ page: string; order: string[] }>;
}): CheckResult[] {
  const results: CheckResult[] = [];

  if (input.navigationElements.length < 2) {
    results.push({
      criterion: "3.2.3",
      name: "Consistent Navigation",
      level: "AA",
      status: "info",
      message: "Need multiple pages to check navigation consistency",
    });
    return results;
  }

  // Compare navigation order across pages
  const firstOrder = input.navigationElements[0].order.join(",");
  const isConsistent = input.navigationElements.every(
    nav => nav.order.join(",") === firstOrder
  );

  results.push({
    criterion: "3.2.3",
    name: "Consistent Navigation",
    level: "AA",
    status: isConsistent ? "pass" : "fail",
    message: isConsistent
      ? "Navigation appears in consistent order across pages"
      : "Navigation order varies between pages",
    recommendation: isConsistent
      ? undefined
      : "Maintain consistent navigation order across all pages",
  });

  return results;
}

export function checkConsistentIdentification(input: {
  components: Array<{ function: string; identifiers: string[] }>;
}): CheckResult[] {
  const results: CheckResult[] = [];

  // Group by function
  const inconsistent: string[] = [];

  for (const component of input.components) {
    const uniqueIdentifiers = new Set(component.identifiers);
    if (uniqueIdentifiers.size > 1) {
      inconsistent.push(`${component.function}: ${component.identifiers.join(", ")}`);
    }
  }

  // 3.2.4 Consistent Identification (Level AA)
  results.push({
    criterion: "3.2.4",
    name: "Consistent Identification",
    level: "AA",
    status: inconsistent.length === 0 ? "pass" : "fail",
    message: inconsistent.length === 0
      ? "Components with same function are consistently identified"
      : `Inconsistent identification: ${inconsistent.join("; ")}`,
    recommendation: inconsistent.length === 0
      ? undefined
      : "Use consistent labels/names for components with the same function",
  });

  return results;
}
