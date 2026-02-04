import type { WcagCriterion } from "./types.js";

/**
 * All WCAG 2.1 success criteria organized by category
 */
export const WCAG_CRITERIA: Record<string, WcagCriterion> = {
  // Perceivable - Text Alternatives
  "1.1.1": {
    id: "1.1.1",
    name: "Non-text Content",
    level: "A",
    description: "All non-text content has a text alternative",
    url: "https://www.w3.org/TR/WCAG21/#non-text-content",
    category: "text-alternatives",
  },

  // Perceivable - Time-based Media
  "1.2.1": {
    id: "1.2.1",
    name: "Audio-only and Video-only (Prerecorded)",
    level: "A",
    description: "Alternatives provided for prerecorded audio-only and video-only content",
    url: "https://www.w3.org/TR/WCAG21/#audio-only-and-video-only-prerecorded",
    category: "media",
  },
  "1.2.2": {
    id: "1.2.2",
    name: "Captions (Prerecorded)",
    level: "A",
    description: "Captions provided for prerecorded audio in synchronized media",
    url: "https://www.w3.org/TR/WCAG21/#captions-prerecorded",
    category: "media",
  },
  "1.2.3": {
    id: "1.2.3",
    name: "Audio Description or Media Alternative (Prerecorded)",
    level: "A",
    description: "Audio description or alternative provided for prerecorded video",
    url: "https://www.w3.org/TR/WCAG21/#audio-description-or-media-alternative-prerecorded",
    category: "media",
  },
  "1.2.4": {
    id: "1.2.4",
    name: "Captions (Live)",
    level: "AA",
    description: "Captions provided for live audio in synchronized media",
    url: "https://www.w3.org/TR/WCAG21/#captions-live",
    category: "media",
  },
  "1.2.5": {
    id: "1.2.5",
    name: "Audio Description (Prerecorded)",
    level: "AA",
    description: "Audio description provided for prerecorded video",
    url: "https://www.w3.org/TR/WCAG21/#audio-description-prerecorded",
    category: "media",
  },
  "1.2.6": {
    id: "1.2.6",
    name: "Sign Language (Prerecorded)",
    level: "AAA",
    description: "Sign language interpretation provided for prerecorded audio",
    url: "https://www.w3.org/TR/WCAG21/#sign-language-prerecorded",
    category: "media",
  },
  "1.2.7": {
    id: "1.2.7",
    name: "Extended Audio Description (Prerecorded)",
    level: "AAA",
    description: "Extended audio description provided where pauses are insufficient",
    url: "https://www.w3.org/TR/WCAG21/#extended-audio-description-prerecorded",
    category: "media",
  },
  "1.2.8": {
    id: "1.2.8",
    name: "Media Alternative (Prerecorded)",
    level: "AAA",
    description: "Alternative provided for prerecorded synchronized media",
    url: "https://www.w3.org/TR/WCAG21/#media-alternative-prerecorded",
    category: "media",
  },
  "1.2.9": {
    id: "1.2.9",
    name: "Audio-only (Live)",
    level: "AAA",
    description: "Alternative provided for live audio-only content",
    url: "https://www.w3.org/TR/WCAG21/#audio-only-live",
    category: "media",
  },

  // Perceivable - Adaptable
  "1.3.1": {
    id: "1.3.1",
    name: "Info and Relationships",
    level: "A",
    description: "Information, structure, and relationships can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#info-and-relationships",
    category: "structure",
  },
  "1.3.2": {
    id: "1.3.2",
    name: "Meaningful Sequence",
    level: "A",
    description: "Correct reading sequence can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#meaningful-sequence",
    category: "structure",
  },
  "1.3.3": {
    id: "1.3.3",
    name: "Sensory Characteristics",
    level: "A",
    description: "Instructions don't rely solely on sensory characteristics",
    url: "https://www.w3.org/TR/WCAG21/#sensory-characteristics",
    category: "structure",
  },
  "1.3.4": {
    id: "1.3.4",
    name: "Orientation",
    level: "AA",
    description: "Content not restricted to a single display orientation",
    url: "https://www.w3.org/TR/WCAG21/#orientation",
    category: "structure",
  },
  "1.3.5": {
    id: "1.3.5",
    name: "Identify Input Purpose",
    level: "AA",
    description: "Input field purpose can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#identify-input-purpose",
    category: "forms",
  },
  "1.3.6": {
    id: "1.3.6",
    name: "Identify Purpose",
    level: "AAA",
    description: "Purpose of UI components can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#identify-purpose",
    category: "structure",
  },

  // Perceivable - Distinguishable
  "1.4.1": {
    id: "1.4.1",
    name: "Use of Color",
    level: "A",
    description: "Color is not the only visual means of conveying information",
    url: "https://www.w3.org/TR/WCAG21/#use-of-color",
    category: "text",
  },
  "1.4.2": {
    id: "1.4.2",
    name: "Audio Control",
    level: "A",
    description: "Mechanism to pause, stop, or control audio volume",
    url: "https://www.w3.org/TR/WCAG21/#audio-control",
    category: "media",
  },
  "1.4.3": {
    id: "1.4.3",
    name: "Contrast (Minimum)",
    level: "AA",
    description: "Text has a contrast ratio of at least 4.5:1 (3:1 for large text)",
    url: "https://www.w3.org/TR/WCAG21/#contrast-minimum",
    category: "text",
  },
  "1.4.4": {
    id: "1.4.4",
    name: "Resize Text",
    level: "AA",
    description: "Text can be resized up to 200% without loss of content or functionality",
    url: "https://www.w3.org/TR/WCAG21/#resize-text",
    category: "text",
  },
  "1.4.5": {
    id: "1.4.5",
    name: "Images of Text",
    level: "AA",
    description: "Use text rather than images of text (except for customizable or essential)",
    url: "https://www.w3.org/TR/WCAG21/#images-of-text",
    category: "text",
  },
  "1.4.6": {
    id: "1.4.6",
    name: "Contrast (Enhanced)",
    level: "AAA",
    description: "Text has a contrast ratio of at least 7:1 (4.5:1 for large text)",
    url: "https://www.w3.org/TR/WCAG21/#contrast-enhanced",
    category: "text",
  },
  "1.4.7": {
    id: "1.4.7",
    name: "Low or No Background Audio",
    level: "AAA",
    description: "Prerecorded audio has low/no background noise or can be turned off",
    url: "https://www.w3.org/TR/WCAG21/#low-or-no-background-audio",
    category: "media",
  },
  "1.4.8": {
    id: "1.4.8",
    name: "Visual Presentation",
    level: "AAA",
    description: "Text blocks: select colors, max 80 chars/line, no justify, adequate spacing, 200% resize",
    url: "https://www.w3.org/TR/WCAG21/#visual-presentation",
    category: "text",
  },
  "1.4.9": {
    id: "1.4.9",
    name: "Images of Text (No Exception)",
    level: "AAA",
    description: "Images of text only used for pure decoration or where essential",
    url: "https://www.w3.org/TR/WCAG21/#images-of-text-no-exception",
    category: "text",
  },
  "1.4.10": {
    id: "1.4.10",
    name: "Reflow",
    level: "AA",
    description: "Content reflows at 400% zoom without horizontal scrolling (320px viewport)",
    url: "https://www.w3.org/TR/WCAG21/#reflow",
    category: "text",
  },
  "1.4.11": {
    id: "1.4.11",
    name: "Non-text Contrast",
    level: "AA",
    description: "UI components and graphics have 3:1 contrast ratio",
    url: "https://www.w3.org/TR/WCAG21/#non-text-contrast",
    category: "text",
  },
  "1.4.12": {
    id: "1.4.12",
    name: "Text Spacing",
    level: "AA",
    description: "No loss of content when: line-height 1.5x, paragraph spacing 2x, letter spacing 0.12x, word spacing 0.16x",
    url: "https://www.w3.org/TR/WCAG21/#text-spacing",
    category: "text",
  },
  "1.4.13": {
    id: "1.4.13",
    name: "Content on Hover or Focus",
    level: "AA",
    description: "Additional content on hover/focus is dismissible, hoverable, and persistent",
    url: "https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus",
    category: "keyboard",
  },

  // Operable - Keyboard Accessible
  "2.1.1": {
    id: "2.1.1",
    name: "Keyboard",
    level: "A",
    description: "All functionality available from keyboard",
    url: "https://www.w3.org/TR/WCAG21/#keyboard",
    category: "keyboard",
  },
  "2.1.2": {
    id: "2.1.2",
    name: "No Keyboard Trap",
    level: "A",
    description: "Keyboard focus can be moved away from any component",
    url: "https://www.w3.org/TR/WCAG21/#no-keyboard-trap",
    category: "keyboard",
  },
  "2.1.3": {
    id: "2.1.3",
    name: "Keyboard (No Exception)",
    level: "AAA",
    description: "All functionality available from keyboard without exception",
    url: "https://www.w3.org/TR/WCAG21/#keyboard-no-exception",
    category: "keyboard",
  },
  "2.1.4": {
    id: "2.1.4",
    name: "Character Key Shortcuts",
    level: "A",
    description: "Character key shortcuts can be turned off or remapped",
    url: "https://www.w3.org/TR/WCAG21/#character-key-shortcuts",
    category: "keyboard",
  },

  // Operable - Enough Time
  "2.2.1": {
    id: "2.2.1",
    name: "Timing Adjustable",
    level: "A",
    description: "Time limits can be turned off, adjusted, or extended",
    url: "https://www.w3.org/TR/WCAG21/#timing-adjustable",
    category: "keyboard",
  },
  "2.2.2": {
    id: "2.2.2",
    name: "Pause, Stop, Hide",
    level: "A",
    description: "Moving, blinking, scrolling, or auto-updating content can be paused, stopped, or hidden",
    url: "https://www.w3.org/TR/WCAG21/#pause-stop-hide",
    category: "media",
  },
  "2.2.3": {
    id: "2.2.3",
    name: "No Timing",
    level: "AAA",
    description: "Timing is not essential part of the activity",
    url: "https://www.w3.org/TR/WCAG21/#no-timing",
    category: "keyboard",
  },
  "2.2.4": {
    id: "2.2.4",
    name: "Interruptions",
    level: "AAA",
    description: "Interruptions can be postponed or suppressed",
    url: "https://www.w3.org/TR/WCAG21/#interruptions",
    category: "keyboard",
  },
  "2.2.5": {
    id: "2.2.5",
    name: "Re-authenticating",
    level: "AAA",
    description: "Data preserved after re-authentication",
    url: "https://www.w3.org/TR/WCAG21/#re-authenticating",
    category: "forms",
  },
  "2.2.6": {
    id: "2.2.6",
    name: "Timeouts",
    level: "AAA",
    description: "Users warned of inactivity timeouts that cause data loss",
    url: "https://www.w3.org/TR/WCAG21/#timeouts",
    category: "forms",
  },

  // Operable - Seizures and Physical Reactions
  "2.3.1": {
    id: "2.3.1",
    name: "Three Flashes or Below Threshold",
    level: "A",
    description: "No content flashes more than 3 times per second",
    url: "https://www.w3.org/TR/WCAG21/#three-flashes-or-below-threshold",
    category: "media",
  },
  "2.3.2": {
    id: "2.3.2",
    name: "Three Flashes",
    level: "AAA",
    description: "No content flashes more than 3 times per second",
    url: "https://www.w3.org/TR/WCAG21/#three-flashes",
    category: "media",
  },
  "2.3.3": {
    id: "2.3.3",
    name: "Animation from Interactions",
    level: "AAA",
    description: "Motion animation can be disabled",
    url: "https://www.w3.org/TR/WCAG21/#animation-from-interactions",
    category: "media",
  },

  // Operable - Navigable
  "2.4.1": {
    id: "2.4.1",
    name: "Bypass Blocks",
    level: "A",
    description: "Mechanism to bypass repeated blocks of content",
    url: "https://www.w3.org/TR/WCAG21/#bypass-blocks",
    category: "structure",
  },
  "2.4.2": {
    id: "2.4.2",
    name: "Page Titled",
    level: "A",
    description: "Pages have descriptive titles",
    url: "https://www.w3.org/TR/WCAG21/#page-titled",
    category: "structure",
  },
  "2.4.3": {
    id: "2.4.3",
    name: "Focus Order",
    level: "A",
    description: "Focus order preserves meaning and operability",
    url: "https://www.w3.org/TR/WCAG21/#focus-order",
    category: "keyboard",
  },
  "2.4.4": {
    id: "2.4.4",
    name: "Link Purpose (In Context)",
    level: "A",
    description: "Link purpose can be determined from link text or context",
    url: "https://www.w3.org/TR/WCAG21/#link-purpose-in-context",
    category: "structure",
  },
  "2.4.5": {
    id: "2.4.5",
    name: "Multiple Ways",
    level: "AA",
    description: "More than one way to locate a page within a set of pages",
    url: "https://www.w3.org/TR/WCAG21/#multiple-ways",
    category: "structure",
  },
  "2.4.6": {
    id: "2.4.6",
    name: "Headings and Labels",
    level: "AA",
    description: "Headings and labels describe topic or purpose",
    url: "https://www.w3.org/TR/WCAG21/#headings-and-labels",
    category: "structure",
  },
  "2.4.7": {
    id: "2.4.7",
    name: "Focus Visible",
    level: "AA",
    description: "Keyboard focus indicator is visible",
    url: "https://www.w3.org/TR/WCAG21/#focus-visible",
    category: "keyboard",
  },
  "2.4.8": {
    id: "2.4.8",
    name: "Location",
    level: "AAA",
    description: "Information about user's location within a set of pages",
    url: "https://www.w3.org/TR/WCAG21/#location",
    category: "structure",
  },
  "2.4.9": {
    id: "2.4.9",
    name: "Link Purpose (Link Only)",
    level: "AAA",
    description: "Link purpose can be determined from link text alone",
    url: "https://www.w3.org/TR/WCAG21/#link-purpose-link-only",
    category: "structure",
  },
  "2.4.10": {
    id: "2.4.10",
    name: "Section Headings",
    level: "AAA",
    description: "Section headings are used to organize content",
    url: "https://www.w3.org/TR/WCAG21/#section-headings",
    category: "structure",
  },

  // Operable - Input Modalities
  "2.5.1": {
    id: "2.5.1",
    name: "Pointer Gestures",
    level: "A",
    description: "Multipoint or path-based gestures have single-pointer alternatives",
    url: "https://www.w3.org/TR/WCAG21/#pointer-gestures",
    category: "keyboard",
  },
  "2.5.2": {
    id: "2.5.2",
    name: "Pointer Cancellation",
    level: "A",
    description: "Single-pointer functions can be cancelled",
    url: "https://www.w3.org/TR/WCAG21/#pointer-cancellation",
    category: "keyboard",
  },
  "2.5.3": {
    id: "2.5.3",
    name: "Label in Name",
    level: "A",
    description: "Accessible name contains the visible label text",
    url: "https://www.w3.org/TR/WCAG21/#label-in-name",
    category: "forms",
  },
  "2.5.4": {
    id: "2.5.4",
    name: "Motion Actuation",
    level: "A",
    description: "Motion-triggered functions can be disabled and have alternatives",
    url: "https://www.w3.org/TR/WCAG21/#motion-actuation",
    category: "keyboard",
  },
  "2.5.5": {
    id: "2.5.5",
    name: "Target Size",
    level: "AAA",
    description: "Target size is at least 44×44 CSS pixels",
    url: "https://www.w3.org/TR/WCAG21/#target-size",
    category: "keyboard",
  },
  "2.5.6": {
    id: "2.5.6",
    name: "Concurrent Input Mechanisms",
    level: "AAA",
    description: "Input modalities are not restricted",
    url: "https://www.w3.org/TR/WCAG21/#concurrent-input-mechanisms",
    category: "keyboard",
  },

  // Understandable - Readable
  "3.1.1": {
    id: "3.1.1",
    name: "Language of Page",
    level: "A",
    description: "Default language of the page can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#language-of-page",
    category: "text",
  },
  "3.1.2": {
    id: "3.1.2",
    name: "Language of Parts",
    level: "AA",
    description: "Language of passages/phrases can be programmatically determined",
    url: "https://www.w3.org/TR/WCAG21/#language-of-parts",
    category: "text",
  },
  "3.1.3": {
    id: "3.1.3",
    name: "Unusual Words",
    level: "AAA",
    description: "Mechanism for identifying definitions of unusual words",
    url: "https://www.w3.org/TR/WCAG21/#unusual-words",
    category: "text",
  },
  "3.1.4": {
    id: "3.1.4",
    name: "Abbreviations",
    level: "AAA",
    description: "Mechanism for identifying expanded form of abbreviations",
    url: "https://www.w3.org/TR/WCAG21/#abbreviations",
    category: "text",
  },
  "3.1.5": {
    id: "3.1.5",
    name: "Reading Level",
    level: "AAA",
    description: "Supplemental content available when text requires advanced reading",
    url: "https://www.w3.org/TR/WCAG21/#reading-level",
    category: "text",
  },
  "3.1.6": {
    id: "3.1.6",
    name: "Pronunciation",
    level: "AAA",
    description: "Mechanism for identifying pronunciation of words",
    url: "https://www.w3.org/TR/WCAG21/#pronunciation",
    category: "text",
  },

  // Understandable - Predictable
  "3.2.1": {
    id: "3.2.1",
    name: "On Focus",
    level: "A",
    description: "Focus does not trigger unexpected context changes",
    url: "https://www.w3.org/TR/WCAG21/#on-focus",
    category: "keyboard",
  },
  "3.2.2": {
    id: "3.2.2",
    name: "On Input",
    level: "A",
    description: "Input does not trigger unexpected context changes",
    url: "https://www.w3.org/TR/WCAG21/#on-input",
    category: "forms",
  },
  "3.2.3": {
    id: "3.2.3",
    name: "Consistent Navigation",
    level: "AA",
    description: "Navigation is consistent across pages",
    url: "https://www.w3.org/TR/WCAG21/#consistent-navigation",
    category: "structure",
  },
  "3.2.4": {
    id: "3.2.4",
    name: "Consistent Identification",
    level: "AA",
    description: "Components with same functionality identified consistently",
    url: "https://www.w3.org/TR/WCAG21/#consistent-identification",
    category: "structure",
  },
  "3.2.5": {
    id: "3.2.5",
    name: "Change on Request",
    level: "AAA",
    description: "Context changes only on user request",
    url: "https://www.w3.org/TR/WCAG21/#change-on-request",
    category: "forms",
  },

  // Understandable - Input Assistance
  "3.3.1": {
    id: "3.3.1",
    name: "Error Identification",
    level: "A",
    description: "Input errors are identified and described in text",
    url: "https://www.w3.org/TR/WCAG21/#error-identification",
    category: "forms",
  },
  "3.3.2": {
    id: "3.3.2",
    name: "Labels or Instructions",
    level: "A",
    description: "Labels or instructions provided for user input",
    url: "https://www.w3.org/TR/WCAG21/#labels-or-instructions",
    category: "forms",
  },
  "3.3.3": {
    id: "3.3.3",
    name: "Error Suggestion",
    level: "AA",
    description: "Suggestions provided for correcting input errors",
    url: "https://www.w3.org/TR/WCAG21/#error-suggestion",
    category: "forms",
  },
  "3.3.4": {
    id: "3.3.4",
    name: "Error Prevention (Legal, Financial, Data)",
    level: "AA",
    description: "Submissions are reversible, checked, or confirmed",
    url: "https://www.w3.org/TR/WCAG21/#error-prevention-legal-financial-data",
    category: "forms",
  },
  "3.3.5": {
    id: "3.3.5",
    name: "Help",
    level: "AAA",
    description: "Context-sensitive help is available",
    url: "https://www.w3.org/TR/WCAG21/#help",
    category: "forms",
  },
  "3.3.6": {
    id: "3.3.6",
    name: "Error Prevention (All)",
    level: "AAA",
    description: "All submissions are reversible, checked, or confirmed",
    url: "https://www.w3.org/TR/WCAG21/#error-prevention-all",
    category: "forms",
  },

  // Robust - Compatible
  "4.1.1": {
    id: "4.1.1",
    name: "Parsing",
    level: "A",
    description: "Elements have complete start/end tags and are properly nested (obsolete in WCAG 2.2)",
    url: "https://www.w3.org/TR/WCAG21/#parsing",
    category: "aria",
  },
  "4.1.2": {
    id: "4.1.2",
    name: "Name, Role, Value",
    level: "A",
    description: "UI components have accessible name, role, states, properties, and values",
    url: "https://www.w3.org/TR/WCAG21/#name-role-value",
    category: "aria",
  },
  "4.1.3": {
    id: "4.1.3",
    name: "Status Messages",
    level: "AA",
    description: "Status messages can be programmatically determined without focus",
    url: "https://www.w3.org/TR/WCAG21/#status-messages",
    category: "aria",
  },
};

/**
 * Get criteria by category
 */
export function getCriteriaByCategory(category: string): WcagCriterion[] {
  return Object.values(WCAG_CRITERIA).filter(c => c.category === category);
}

/**
 * Get criteria by level
 */
export function getCriteriaByLevel(level: "A" | "AA" | "AAA"): WcagCriterion[] {
  return Object.values(WCAG_CRITERIA).filter(c => c.level === level);
}

/**
 * Get a single criterion by ID
 */
export function getCriterion(id: string): WcagCriterion | undefined {
  return WCAG_CRITERIA[id];
}

/**
 * Available categories
 */
export const CATEGORIES = [
  "text",
  "media",
  "structure",
  "keyboard",
  "forms",
  "aria",
  "text-alternatives",
] as const;

export type WcagCategory = typeof CATEGORIES[number];
