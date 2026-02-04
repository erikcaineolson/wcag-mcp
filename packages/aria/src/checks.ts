import type { CheckResult } from "@wcag-mcp/core";

// =============================================================================
// Types
// =============================================================================

/** Valid ARIA roles */
export type AriaRole =
  | "alert" | "alertdialog" | "application" | "article" | "banner"
  | "button" | "cell" | "checkbox" | "columnheader" | "combobox"
  | "complementary" | "contentinfo" | "definition" | "dialog" | "directory"
  | "document" | "feed" | "figure" | "form" | "grid" | "gridcell"
  | "group" | "heading" | "img" | "link" | "list" | "listbox"
  | "listitem" | "log" | "main" | "marquee" | "math" | "menu"
  | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "meter"
  | "navigation" | "none" | "note" | "option" | "presentation" | "progressbar"
  | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader"
  | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton"
  | "status" | "switch" | "tab" | "table" | "tablist" | "tabpanel"
  | "term" | "textbox" | "timer" | "toolbar" | "tooltip" | "tree"
  | "treegrid" | "treeitem";

/** Roles that require accessible names */
const ROLES_REQUIRING_NAME: string[] = [
  "alert", "alertdialog", "button", "checkbox", "combobox", "dialog",
  "figure", "form", "grid", "heading", "img", "link", "listbox", "log",
  "marquee", "menu", "menubar", "meter", "navigation", "progressbar",
  "radio", "radiogroup", "region", "scrollbar", "search", "searchbox",
  "slider", "spinbutton", "status", "switch", "tab", "table", "tablist",
  "tabpanel", "textbox", "timer", "toolbar", "tree", "treegrid",
];

/** Roles that are interactive */
const INTERACTIVE_ROLES: string[] = [
  "button", "checkbox", "combobox", "gridcell", "link", "listbox",
  "menu", "menubar", "menuitem", "menuitemcheckbox", "menuitemradio",
  "option", "radio", "scrollbar", "searchbox", "slider", "spinbutton",
  "switch", "tab", "textbox", "treeitem",
];

/** Landmark roles */
const LANDMARK_ROLES: string[] = [
  "banner", "complementary", "contentinfo", "form", "main",
  "navigation", "region", "search",
];

export interface AriaElementInput {
  /** The element's role (explicit or implicit) */
  role?: string;
  /** The element's accessible name */
  accessibleName?: string;
  /** The element's accessible description */
  accessibleDescription?: string;
  /** HTML tag name */
  tagName: string;
  /** Whether element is focusable */
  isFocusable?: boolean;
  /** ARIA states and properties */
  ariaAttributes?: Record<string, string>;
  /** Whether the element is interactive */
  isInteractive?: boolean;
  /** ID attribute */
  id?: string;
  /** Elements this one labels (aria-labelledby references) */
  labelledBy?: string[];
  /** Elements this one describes (aria-describedby references) */
  describedBy?: string[];
}

export interface StatusMessageInput {
  /** Whether status message uses live region */
  hasLiveRegion: boolean;
  /** aria-live value */
  ariaLive?: "polite" | "assertive" | "off";
  /** aria-atomic value */
  ariaAtomic?: boolean;
  /** Whether status role is used */
  hasStatusRole?: boolean;
  /** Whether alert role is used */
  hasAlertRole?: boolean;
  /** Whether message requires focus to be perceived */
  requiresFocus?: boolean;
}

export interface NameRoleValueInput {
  /** Element being checked */
  element: AriaElementInput;
  /** Current state values */
  states?: {
    expanded?: boolean;
    selected?: boolean;
    checked?: boolean | "mixed";
    pressed?: boolean | "mixed";
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    readonly?: boolean;
  };
  /** Whether state changes are communicated to AT */
  statesAreCommunicated?: boolean;
}

// =============================================================================
// Check Functions
// =============================================================================

export function checkNameRoleValue(input: NameRoleValueInput): CheckResult[] {
  const results: CheckResult[] = [];
  const { element, states, statesAreCommunicated } = input;
  const role = element.role || getImplicitRole(element.tagName);

  // Check accessible name
  const needsName = role && ROLES_REQUIRING_NAME.includes(role);
  const hasName = !!element.accessibleName && element.accessibleName.trim().length > 0;

  if (needsName) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: hasName ? "pass" : "fail",
      value: element.accessibleName || "(none)",
      message: hasName
        ? `Element has accessible name: "${element.accessibleName}"`
        : `Element with role "${role}" is missing accessible name`,
      recommendation: hasName
        ? undefined
        : `Add accessible name via aria-label, aria-labelledby, or native labeling mechanism`,
    });
  }

  // Check role is valid
  if (element.role) {
    const isValidRole = isValidAriaRole(element.role);
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: isValidRole ? "pass" : "fail",
      value: element.role,
      message: isValidRole
        ? `Valid ARIA role: "${element.role}"`
        : `Invalid ARIA role: "${element.role}"`,
      recommendation: isValidRole
        ? undefined
        : "Use a valid ARIA role from the WAI-ARIA specification",
    });
  }

  // Check states are communicated
  if (states && Object.keys(states).length > 0 && statesAreCommunicated !== undefined) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: statesAreCommunicated ? "pass" : "fail",
      value: statesAreCommunicated,
      message: statesAreCommunicated
        ? "State changes are communicated to assistive technology"
        : "State changes may not be communicated to assistive technology",
      recommendation: statesAreCommunicated
        ? undefined
        : "Use appropriate ARIA states (aria-expanded, aria-selected, etc.) that update dynamically",
    });
  }

  // Check focusable interactive elements
  if (role && INTERACTIVE_ROLES.includes(role) && element.isFocusable === false) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: "fail",
      message: `Interactive element with role "${role}" is not keyboard focusable`,
      recommendation: "Ensure interactive elements can receive keyboard focus (tabindex=0 or native focusable element)",
    });
  }

  return results;
}

export function checkStatusMessage(input: StatusMessageInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 4.1.3 Status Messages (Level AA)
  if (input.requiresFocus) {
    results.push({
      criterion: "4.1.3",
      name: "Status Messages",
      level: "AA",
      status: "fail",
      message: "Status message requires focus to be perceived",
      recommendation: "Use aria-live regions or status/alert roles so messages are announced without focus",
    });
    return results;
  }

  const hasProperMarkup = input.hasLiveRegion || input.hasStatusRole || input.hasAlertRole;

  if (!hasProperMarkup) {
    results.push({
      criterion: "4.1.3",
      name: "Status Messages",
      level: "AA",
      status: "fail",
      message: "Status message lacks live region or status role",
      recommendation: "Add role=\"status\" or aria-live=\"polite\" for status messages, role=\"alert\" for urgent messages",
    });
    return results;
  }

  // Check appropriate live region usage
  if (input.hasAlertRole && input.ariaLive === "polite") {
    results.push({
      criterion: "4.1.3",
      name: "Status Messages",
      level: "AA",
      status: "warning",
      message: "Alert role with polite live region may be redundant",
      recommendation: "role=\"alert\" implies aria-live=\"assertive\"; consider using one or the other",
    });
  }

  results.push({
    criterion: "4.1.3",
    name: "Status Messages",
    level: "AA",
    status: "pass",
    message: `Status message properly announced via ${[
      input.hasStatusRole && "role=\"status\"",
      input.hasAlertRole && "role=\"alert\"",
      input.hasLiveRegion && `aria-live="${input.ariaLive}"`,
    ].filter(Boolean).join(", ")}`,
  });

  return results;
}

export function checkAriaAttributes(element: AriaElementInput): CheckResult[] {
  const results: CheckResult[] = [];
  const attrs = element.ariaAttributes || {};

  // Check for deprecated or invalid ARIA usage
  const issues: string[] = [];

  // aria-label on non-interactive element without role
  if (attrs["aria-label"] && !element.role && !element.isInteractive) {
    issues.push("aria-label on non-interactive element without explicit role");
  }

  // aria-hidden on focusable element
  if (attrs["aria-hidden"] === "true" && element.isFocusable) {
    issues.push("aria-hidden=\"true\" on focusable element");
  }

  // aria-expanded on element that doesn't support it
  const supportsExpanded = ["button", "combobox", "link", "menuitem", "row", "tab", "treeitem"];
  if (attrs["aria-expanded"] && element.role && !supportsExpanded.includes(element.role)) {
    issues.push(`aria-expanded not supported on role "${element.role}"`);
  }

  // aria-checked on element that doesn't support it
  const supportsChecked = ["checkbox", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch"];
  if (attrs["aria-checked"] && element.role && !supportsChecked.includes(element.role)) {
    issues.push(`aria-checked not supported on role "${element.role}"`);
  }

  if (issues.length > 0) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: "fail",
      message: `ARIA attribute issues: ${issues.join("; ")}`,
      recommendation: "Use ARIA attributes only as specified in the WAI-ARIA specification",
    });
  } else if (Object.keys(attrs).length > 0) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: "pass",
      message: "ARIA attributes are used appropriately",
    });
  }

  // Check for required owned elements
  const roleOwns: Record<string, string[]> = {
    list: ["listitem"],
    menu: ["menuitem", "menuitemcheckbox", "menuitemradio"],
    menubar: ["menuitem", "menuitemcheckbox", "menuitemradio"],
    tablist: ["tab"],
    tree: ["treeitem", "group"],
    grid: ["row", "rowgroup"],
    table: ["row", "rowgroup"],
    radiogroup: ["radio"],
    listbox: ["option"],
  };

  // This would need DOM traversal to fully check, but we can note the requirement
  if (element.role && roleOwns[element.role]) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: "info",
      message: `Role "${element.role}" must contain: ${roleOwns[element.role].join(" or ")}`,
    });
  }

  return results;
}

export function checkLandmarks(landmarks: Array<{ role: string; label?: string }>): CheckResult[] {
  const results: CheckResult[] = [];

  // Check for multiple landmarks of same type
  const landmarkCounts: Record<string, number> = {};
  const landmarkLabels: Record<string, string[]> = {};

  for (const landmark of landmarks) {
    landmarkCounts[landmark.role] = (landmarkCounts[landmark.role] || 0) + 1;
    if (!landmarkLabels[landmark.role]) {
      landmarkLabels[landmark.role] = [];
    }
    landmarkLabels[landmark.role].push(landmark.label || "(unlabeled)");
  }

  // Multiple landmarks of same type need unique labels
  for (const [role, count] of Object.entries(landmarkCounts)) {
    if (count > 1) {
      const labels = landmarkLabels[role];
      const uniqueLabels = new Set(labels);
      const hasUniqueLabels = uniqueLabels.size === count && !uniqueLabels.has("(unlabeled)");

      results.push({
        criterion: "4.1.2",
        name: "Name, Role, Value",
        level: "A",
        status: hasUniqueLabels ? "pass" : "fail",
        value: `${count} ${role} landmarks`,
        message: hasUniqueLabels
          ? `Multiple ${role} landmarks have unique labels`
          : `Multiple ${role} landmarks lack unique labels: ${labels.join(", ")}`,
        recommendation: hasUniqueLabels
          ? undefined
          : `Add unique aria-label or aria-labelledby to distinguish ${role} landmarks`,
      });
    }
  }

  // Check main landmark exists
  if (!landmarkCounts["main"]) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: "warning",
      message: "No main landmark found",
      recommendation: "Add role=\"main\" or use <main> element for primary content",
    });
  }

  if (results.length === 0 && landmarks.length > 0) {
    results.push({
      criterion: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      status: "pass",
      message: `${landmarks.length} landmark(s) properly defined`,
    });
  }

  return results;
}

export function checkLabelInName(input: {
  visibleLabel: string;
  accessibleName: string;
}): CheckResult[] {
  const results: CheckResult[] = [];

  const visible = input.visibleLabel.toLowerCase().trim();
  const accessible = input.accessibleName.toLowerCase().trim();

  // 2.5.3 Label in Name (Level A)
  const labelInName = accessible.includes(visible);

  results.push({
    criterion: "2.5.3",
    name: "Label in Name",
    level: "A",
    status: labelInName ? "pass" : "fail",
    value: `Visible: "${input.visibleLabel}" | Accessible: "${input.accessibleName}"`,
    message: labelInName
      ? "Accessible name contains the visible label text"
      : "Accessible name does NOT contain the visible label text",
    recommendation: labelInName
      ? undefined
      : "Ensure the accessible name includes the visible label text, ideally at the start",
  });

  // Best practice: visible label at start of accessible name
  if (labelInName && !accessible.startsWith(visible)) {
    results.push({
      criterion: "2.5.3",
      name: "Label in Name",
      level: "A",
      status: "warning",
      message: "Visible label is not at the start of accessible name",
      recommendation: "Place the visible label at the beginning of the accessible name for better voice control compatibility",
    });
  }

  return results;
}

// =============================================================================
// Helper Functions
// =============================================================================

function isValidAriaRole(role: string): boolean {
  const validRoles: string[] = [
    "alert", "alertdialog", "application", "article", "banner",
    "button", "cell", "checkbox", "columnheader", "combobox",
    "complementary", "contentinfo", "definition", "dialog", "directory",
    "document", "feed", "figure", "form", "grid", "gridcell",
    "group", "heading", "img", "link", "list", "listbox",
    "listitem", "log", "main", "marquee", "math", "menu",
    "menubar", "menuitem", "menuitemcheckbox", "menuitemradio", "meter",
    "navigation", "none", "note", "option", "presentation", "progressbar",
    "radio", "radiogroup", "region", "row", "rowgroup", "rowheader",
    "scrollbar", "search", "searchbox", "separator", "slider", "spinbutton",
    "status", "switch", "tab", "table", "tablist", "tabpanel",
    "term", "textbox", "timer", "toolbar", "tooltip", "tree",
    "treegrid", "treeitem",
  ];
  return validRoles.includes(role);
}

function getImplicitRole(tagName: string): string | undefined {
  const implicitRoles: Record<string, string> = {
    a: "link",
    article: "article",
    aside: "complementary",
    button: "button",
    datalist: "listbox",
    details: "group",
    dialog: "dialog",
    fieldset: "group",
    figure: "figure",
    footer: "contentinfo",
    form: "form",
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
    header: "banner",
    hr: "separator",
    img: "img",
    input: "textbox",
    li: "listitem",
    main: "main",
    math: "math",
    menu: "list",
    nav: "navigation",
    ol: "list",
    optgroup: "group",
    option: "option",
    output: "status",
    progress: "progressbar",
    section: "region",
    select: "listbox",
    summary: "button",
    table: "table",
    tbody: "rowgroup",
    td: "cell",
    textarea: "textbox",
    tfoot: "rowgroup",
    th: "columnheader",
    thead: "rowgroup",
    tr: "row",
    ul: "list",
  };
  return implicitRoles[tagName.toLowerCase()];
}
