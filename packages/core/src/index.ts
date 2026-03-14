// Types
export type {
  WcagLevel,
  CheckStatus,
  CheckResult,
  WcagCriterion,
  ReportSummary,
  MachineReport,
  ValidationReport,
  ToolDefinition,
} from "./types.js";

// Criteria
export {
  WCAG_CRITERIA,
  getCriteriaByCategory,
  getCriteriaByLevel,
  getCriterion,
  CATEGORIES,
} from "./criteria.js";
export type { WcagCategory } from "./criteria.js";

// Report utilities
export {
  formatHumanReport,
  formatMachineReport,
  formatMarkdownReport,
  createReport,
  formatToolResponse,
  formatErrorResponse,
} from "./report.js";
