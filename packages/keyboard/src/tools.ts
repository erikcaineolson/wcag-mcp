import type { ToolDefinition } from "@wcag-mcp/core";

export const KEYBOARD_TOOLS: ToolDefinition[] = [
  {
    name: "check_keyboard_access",
    description: "Check WCAG keyboard accessibility (2.1.1, 2.1.2, 2.1.4, 2.4.3, 3.2.1). Validates keyboard operability, focus trapping, and shortcuts.",
    inputSchema: {
      type: "object",
      properties: {
        elementType: { type: "string", description: "Element type (button, link, input, div, etc.)" },
        isFocusable: { type: "boolean", description: "Whether the element can receive keyboard focus" },
        hasFocusIndicator: { type: "boolean", description: "Whether the element has a visible focus indicator" },
        tabIndex: { type: "number", description: "Tab index value if set" },
        canEscapeFocus: { type: "boolean", description: "Whether focus can be moved away using keyboard" },
        hasKeyboardAccess: { type: "boolean", description: "Whether all functionality is keyboard accessible" },
        changesContextOnFocus: { type: "boolean", description: "Whether receiving focus triggers context change" },
        hasCharacterShortcuts: { type: "boolean", description: "Whether there are single character key shortcuts" },
        shortcutsConfigurable: { type: "boolean", description: "Whether shortcuts can be turned off or remapped" },
        focusOrderIssues: {
          type: "array",
          items: { type: "string" },
          description: "List of focus order issues detected",
        },
      },
      required: ["elementType"],
    },
  },
  {
    name: "check_focus_indicator",
    description: "Check WCAG 2.4.7 Focus Visible requirement. Validates that focus indicators are visible and have sufficient contrast.",
    inputSchema: {
      type: "object",
      properties: {
        isVisible: { type: "boolean", description: "Whether the focus indicator is visible" },
        contrastRatio: { type: "number", description: "Focus indicator contrast ratio against background" },
        indicatorStyle: { type: "string", description: "Focus indicator style (outline, border, background, etc.)" },
        indicatorSize: { type: "number", description: "Minimum size of focus indicator in pixels" },
      },
      required: ["isVisible"],
    },
  },
  {
    name: "check_timing",
    description: "Check WCAG timing requirements (2.2.1, 2.2.3). Validates time limits can be adjusted or turned off.",
    inputSchema: {
      type: "object",
      properties: {
        hasTimeLimit: { type: "boolean", description: "Whether there are time limits" },
        canTurnOff: { type: "boolean", description: "Whether time limit can be turned off" },
        canAdjust: { type: "boolean", description: "Whether time limit can be adjusted" },
        canExtend: { type: "boolean", description: "Whether time limit can be extended" },
        isEssential: { type: "boolean", description: "Whether timing is essential to the activity" },
      },
      required: ["hasTimeLimit"],
    },
  },
  {
    name: "check_motion",
    description: "Check WCAG 2.5.4 Motion Actuation. Validates motion-triggered functionality can be disabled.",
    inputSchema: {
      type: "object",
      properties: {
        hasMotionActuation: { type: "boolean", description: "Whether there is motion-triggered functionality" },
        canDisableMotion: { type: "boolean", description: "Whether motion can be disabled" },
        hasAlternative: { type: "boolean", description: "Whether there are non-motion alternatives" },
        isEssential: { type: "boolean", description: "Whether motion is essential to the function" },
      },
      required: ["hasMotionActuation"],
    },
  },
  {
    name: "check_pointer_gestures",
    description: "Check WCAG 2.5.1 Pointer Gestures. Validates that complex gestures have single-pointer alternatives.",
    inputSchema: {
      type: "object",
      properties: {
        hasMultipointGestures: { type: "boolean", description: "Whether multipoint gestures (pinch, multi-finger) are required" },
        hasPathBasedGestures: { type: "boolean", description: "Whether path-based gestures (swipe, drag) are required" },
        hasSinglePointerAlternative: { type: "boolean", description: "Whether single-pointer alternatives exist" },
        isEssential: { type: "boolean", description: "Whether complex gestures are essential" },
      },
      required: ["hasMultipointGestures", "hasPathBasedGestures"],
    },
  },
  {
    name: "check_pointer_cancellation",
    description: "Check WCAG 2.5.2 Pointer Cancellation. Validates single-pointer actions can be cancelled.",
    inputSchema: {
      type: "object",
      properties: {
        elementType: { type: "string", description: "Element type being checked" },
        activatesOnDown: { type: "boolean", description: "Whether action activates on pointer down (not up)" },
        canAbort: { type: "boolean", description: "Whether action can be aborted by moving pointer away" },
        canUndo: { type: "boolean", description: "Whether action can be undone after completion" },
        isEssential: { type: "boolean", description: "Whether down-event is essential" },
      },
      required: ["elementType"],
    },
  },
  {
    name: "check_target_size",
    description: "Check WCAG 2.5.5 Target Size (AAA). Validates touch/click targets are at least 44×44 pixels.",
    inputSchema: {
      type: "object",
      properties: {
        elementType: { type: "string", description: "Element type being checked" },
        width: { type: "number", description: "Target width in CSS pixels" },
        height: { type: "number", description: "Target height in CSS pixels" },
        hasSpacing: { type: "boolean", description: "Whether adequate spacing exists around target" },
      },
      required: ["elementType", "width", "height"],
    },
  },
  {
    name: "get_wcag_keyboard_criteria",
    description: "Get reference information for all WCAG 2.1 keyboard-related success criteria.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
