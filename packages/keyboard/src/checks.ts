import type { CheckResult } from "@wcag-mcp/core";

// =============================================================================
// Types
// =============================================================================

export interface KeyboardAccessibilityInput {
  /** Element type being checked (button, link, input, etc.) */
  elementType: string;
  /** Whether the element is keyboard focusable */
  isFocusable?: boolean;
  /** Whether the element has a visible focus indicator */
  hasFocusIndicator?: boolean;
  /** Tab index value if set */
  tabIndex?: number;
  /** Whether focus can be moved away from the element */
  canEscapeFocus?: boolean;
  /** Whether functionality is available via keyboard */
  hasKeyboardAccess?: boolean;
  /** Access key if defined */
  accessKey?: string;
  /** Whether element triggers context change on focus */
  changesContextOnFocus?: boolean;
  /** Whether there are character key shortcuts */
  hasCharacterShortcuts?: boolean;
  /** Whether shortcuts can be turned off or remapped */
  shortcutsConfigurable?: boolean;
  /** Focus order issues detected */
  focusOrderIssues?: string[];
}

export interface FocusIndicatorInput {
  /** Whether focus indicator is visible */
  isVisible: boolean;
  /** Focus indicator contrast ratio (if measurable) */
  contrastRatio?: number;
  /** Focus indicator style (outline, border, background, etc.) */
  indicatorStyle?: string;
  /** Minimum size of focus indicator in pixels */
  indicatorSize?: number;
}

export interface TimingInput {
  /** Whether there are time limits */
  hasTimeLimit: boolean;
  /** Whether time limit can be turned off */
  canTurnOff?: boolean;
  /** Whether time limit can be adjusted */
  canAdjust?: boolean;
  /** Whether time limit can be extended */
  canExtend?: boolean;
  /** Whether timing is essential to the activity */
  isEssential?: boolean;
}

export interface MotionInput {
  /** Whether there is motion-triggered functionality */
  hasMotionActuation: boolean;
  /** Whether motion can be disabled */
  canDisableMotion?: boolean;
  /** Whether there are non-motion alternatives */
  hasAlternative?: boolean;
  /** Whether motion is essential */
  isEssential?: boolean;
}

// =============================================================================
// Check Functions
// =============================================================================

export function checkKeyboardAccessibility(input: KeyboardAccessibilityInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 2.1.1 Keyboard (Level A)
  if (input.hasKeyboardAccess !== undefined) {
    results.push({
      criterion: "2.1.1",
      name: "Keyboard",
      level: "A",
      status: input.hasKeyboardAccess ? "pass" : "fail",
      value: input.hasKeyboardAccess,
      message: input.hasKeyboardAccess
        ? `${input.elementType} functionality is accessible via keyboard`
        : `${input.elementType} functionality is NOT accessible via keyboard`,
      recommendation: input.hasKeyboardAccess
        ? undefined
        : "Ensure all functionality is operable through keyboard interface",
    });
  }

  // 2.1.2 No Keyboard Trap (Level A)
  if (input.canEscapeFocus !== undefined) {
    results.push({
      criterion: "2.1.2",
      name: "No Keyboard Trap",
      level: "A",
      status: input.canEscapeFocus ? "pass" : "fail",
      value: input.canEscapeFocus,
      message: input.canEscapeFocus
        ? `Focus can be moved away from ${input.elementType} using keyboard`
        : `Focus is TRAPPED in ${input.elementType} - cannot escape with keyboard`,
      recommendation: input.canEscapeFocus
        ? undefined
        : "Ensure focus can be moved away using standard keyboard navigation (Tab, Shift+Tab, Escape)",
    });
  }

  // 2.1.4 Character Key Shortcuts (Level A)
  if (input.hasCharacterShortcuts) {
    const passes = input.shortcutsConfigurable === true;
    results.push({
      criterion: "2.1.4",
      name: "Character Key Shortcuts",
      level: "A",
      status: passes ? "pass" : "fail",
      value: input.shortcutsConfigurable,
      message: passes
        ? "Character key shortcuts can be turned off or remapped"
        : "Character key shortcuts exist but cannot be turned off or remapped",
      recommendation: passes
        ? undefined
        : "Allow users to turn off, remap, or make shortcuts only active on focus",
    });
  }

  // 2.4.3 Focus Order (Level A)
  if (input.focusOrderIssues !== undefined) {
    const passes = input.focusOrderIssues.length === 0;
    results.push({
      criterion: "2.4.3",
      name: "Focus Order",
      level: "A",
      status: passes ? "pass" : "fail",
      value: passes,
      message: passes
        ? "Focus order preserves meaning and operability"
        : `Focus order issues: ${input.focusOrderIssues.join(", ")}`,
      recommendation: passes
        ? undefined
        : "Ensure focus order follows a logical sequence that preserves meaning",
    });
  }

  // 3.2.1 On Focus (Level A)
  if (input.changesContextOnFocus !== undefined) {
    const passes = !input.changesContextOnFocus;
    results.push({
      criterion: "3.2.1",
      name: "On Focus",
      level: "A",
      status: passes ? "pass" : "fail",
      value: !input.changesContextOnFocus,
      message: passes
        ? `${input.elementType} does not change context when receiving focus`
        : `${input.elementType} changes context unexpectedly when receiving focus`,
      recommendation: passes
        ? undefined
        : "Do not initiate context changes (form submission, new windows, focus changes) on focus alone",
    });
  }

  // Check for focusability
  if (input.isFocusable !== undefined) {
    const interactive = ["button", "link", "input", "select", "textarea", "a"].includes(
      input.elementType.toLowerCase()
    );
    if (interactive && !input.isFocusable) {
      results.push({
        criterion: "2.1.1",
        name: "Keyboard",
        level: "A",
        status: "fail",
        value: input.isFocusable,
        message: `Interactive ${input.elementType} is not keyboard focusable`,
        recommendation: "Ensure interactive elements are focusable (avoid tabindex=-1 on interactive elements)",
      });
    }
  }

  // Check tabindex usage
  if (input.tabIndex !== undefined && input.tabIndex > 0) {
    results.push({
      criterion: "2.4.3",
      name: "Focus Order",
      level: "A",
      status: "warning",
      value: input.tabIndex,
      message: `Positive tabindex (${input.tabIndex}) may disrupt natural focus order`,
      recommendation: "Avoid positive tabindex values; use DOM order or tabindex=0 instead",
    });
  }

  return results;
}

export function checkFocusIndicator(input: FocusIndicatorInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 2.4.7 Focus Visible (Level AA)
  results.push({
    criterion: "2.4.7",
    name: "Focus Visible",
    level: "AA",
    status: input.isVisible ? "pass" : "fail",
    value: input.isVisible,
    message: input.isVisible
      ? "Focus indicator is visible"
      : "Focus indicator is NOT visible",
    recommendation: input.isVisible
      ? undefined
      : "Ensure a visible focus indicator is present (outline, border, background change, etc.)",
  });

  // Check contrast if provided (WCAG 2.2 adds 2.4.11 Focus Appearance, but we're on 2.1)
  if (input.isVisible && input.contrastRatio !== undefined) {
    const passes = input.contrastRatio >= 3;
    results.push({
      criterion: "2.4.7",
      name: "Focus Visible",
      level: "AA",
      status: passes ? "pass" : "warning",
      value: input.contrastRatio,
      required: 3,
      message: passes
        ? `Focus indicator contrast ratio (${input.contrastRatio}:1) meets minimum (3:1)`
        : `Focus indicator contrast ratio (${input.contrastRatio}:1) may be insufficient`,
      recommendation: passes
        ? undefined
        : "Consider increasing focus indicator contrast to at least 3:1",
    });
  }

  return results;
}

export function checkTiming(input: TimingInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasTimeLimit) {
    results.push({
      criterion: "2.2.1",
      name: "Timing Adjustable",
      level: "A",
      status: "pass",
      message: "No time limits present",
    });
    return results;
  }

  // Essential timing doesn't need to be adjustable
  if (input.isEssential) {
    results.push({
      criterion: "2.2.1",
      name: "Timing Adjustable",
      level: "A",
      status: "pass",
      value: true,
      message: "Time limit is essential to the activity (exempt)",
    });
    return results;
  }

  // 2.2.1 Timing Adjustable (Level A)
  const hasAdjustment = input.canTurnOff || input.canAdjust || input.canExtend;
  results.push({
    criterion: "2.2.1",
    name: "Timing Adjustable",
    level: "A",
    status: hasAdjustment ? "pass" : "fail",
    value: hasAdjustment,
    message: hasAdjustment
      ? `Time limit can be: ${[
          input.canTurnOff && "turned off",
          input.canAdjust && "adjusted",
          input.canExtend && "extended",
        ].filter(Boolean).join(", ")}`
      : "Time limit cannot be turned off, adjusted, or extended",
    recommendation: hasAdjustment
      ? undefined
      : "Allow users to turn off, adjust, or extend time limits (at least 10x the default)",
  });

  // 2.2.3 No Timing (Level AAA)
  results.push({
    criterion: "2.2.3",
    name: "No Timing",
    level: "AAA",
    status: input.canTurnOff ? "pass" : "warning",
    value: input.canTurnOff,
    message: input.canTurnOff
      ? "Time limit can be turned off (meets AAA)"
      : "Time limit exists - consider removing for AAA compliance",
    recommendation: input.canTurnOff
      ? undefined
      : "For AAA, timing should not be an essential part of the activity",
  });

  return results;
}

export function checkMotionActuation(input: MotionInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasMotionActuation) {
    results.push({
      criterion: "2.5.4",
      name: "Motion Actuation",
      level: "A",
      status: "pass",
      message: "No motion-triggered functionality present",
    });
    return results;
  }

  if (input.isEssential) {
    results.push({
      criterion: "2.5.4",
      name: "Motion Actuation",
      level: "A",
      status: "pass",
      message: "Motion actuation is essential to the function (exempt)",
    });
    return results;
  }

  // 2.5.4 Motion Actuation (Level A)
  const passes = input.canDisableMotion || input.hasAlternative;
  results.push({
    criterion: "2.5.4",
    name: "Motion Actuation",
    level: "A",
    status: passes ? "pass" : "fail",
    value: passes,
    message: passes
      ? `Motion actuation: ${[
          input.canDisableMotion && "can be disabled",
          input.hasAlternative && "has alternative input",
        ].filter(Boolean).join(", ")}`
      : "Motion actuation cannot be disabled and has no alternative",
    recommendation: passes
      ? undefined
      : "Provide a way to disable motion actuation and offer alternative input methods",
  });

  return results;
}

export function checkPointerGestures(input: {
  hasMultipointGestures: boolean;
  hasPathBasedGestures: boolean;
  hasSinglePointerAlternative?: boolean;
  isEssential?: boolean;
}): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasMultipointGestures && !input.hasPathBasedGestures) {
    results.push({
      criterion: "2.5.1",
      name: "Pointer Gestures",
      level: "A",
      status: "pass",
      message: "No multipoint or path-based gestures required",
    });
    return results;
  }

  if (input.isEssential) {
    results.push({
      criterion: "2.5.1",
      name: "Pointer Gestures",
      level: "A",
      status: "pass",
      message: "Complex gestures are essential to the function (exempt)",
    });
    return results;
  }

  // 2.5.1 Pointer Gestures (Level A)
  results.push({
    criterion: "2.5.1",
    name: "Pointer Gestures",
    level: "A",
    status: input.hasSinglePointerAlternative ? "pass" : "fail",
    value: input.hasSinglePointerAlternative,
    message: input.hasSinglePointerAlternative
      ? "Single-pointer alternative available for complex gestures"
      : "Complex gestures lack single-pointer alternatives",
    recommendation: input.hasSinglePointerAlternative
      ? undefined
      : "Provide single-pointer alternatives (tap, click) for all multipoint/path-based gestures",
  });

  return results;
}

export function checkPointerCancellation(input: {
  elementType: string;
  activatesOnDown?: boolean;
  canAbort?: boolean;
  canUndo?: boolean;
  isEssential?: boolean;
}): CheckResult[] {
  const results: CheckResult[] = [];

  if (input.isEssential) {
    results.push({
      criterion: "2.5.2",
      name: "Pointer Cancellation",
      level: "A",
      status: "pass",
      message: "Down-event activation is essential (exempt)",
    });
    return results;
  }

  if (!input.activatesOnDown) {
    results.push({
      criterion: "2.5.2",
      name: "Pointer Cancellation",
      level: "A",
      status: "pass",
      message: `${input.elementType} activates on up-event (pointer release)`,
    });
    return results;
  }

  // 2.5.2 Pointer Cancellation (Level A)
  const passes = input.canAbort || input.canUndo;
  results.push({
    criterion: "2.5.2",
    name: "Pointer Cancellation",
    level: "A",
    status: passes ? "pass" : "fail",
    value: passes,
    message: passes
      ? `${input.elementType} down-event: ${[
          input.canAbort && "can be aborted",
          input.canUndo && "can be undone",
        ].filter(Boolean).join(", ")}`
      : `${input.elementType} activates on down-event without abort/undo mechanism`,
    recommendation: passes
      ? undefined
      : "Use up-event for activation, or provide abort mechanism (move pointer away) or undo",
  });

  return results;
}

export function checkTargetSize(input: {
  elementType: string;
  width: number;
  height: number;
  hasSpacing?: boolean;
}): CheckResult[] {
  const results: CheckResult[] = [];
  const minSize = Math.min(input.width, input.height);

  // 2.5.5 Target Size (Level AAA) - 44x44 CSS pixels
  const passesAAA = input.width >= 44 && input.height >= 44;
  results.push({
    criterion: "2.5.5",
    name: "Target Size",
    level: "AAA",
    status: passesAAA ? "pass" : "warning",
    value: `${input.width}×${input.height}`,
    required: "44×44",
    message: passesAAA
      ? `${input.elementType} target size (${input.width}×${input.height}px) meets AAA (44×44px)`
      : `${input.elementType} target size (${input.width}×${input.height}px) below AAA recommendation (44×44px)`,
    recommendation: passesAAA
      ? undefined
      : "Increase target size to at least 44×44 CSS pixels for better touch accessibility",
  });

  // Note: WCAG 2.2 adds 2.5.8 Target Size (Minimum) at AA level (24x24px)
  // We'll add a helpful warning for smaller targets
  if (minSize < 24) {
    results.push({
      criterion: "2.5.5",
      name: "Target Size",
      level: "AAA",
      status: "warning",
      value: minSize,
      message: `${input.elementType} target size (${minSize}px minimum dimension) may be difficult to activate`,
      recommendation: "Consider increasing to at least 24×24px for usability",
    });
  }

  return results;
}
