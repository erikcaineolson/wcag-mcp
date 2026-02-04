/**
 * WCAG conformance levels
 */
export type WcagLevel = "A" | "AA" | "AAA";

/**
 * Check result status
 */
export type CheckStatus = "pass" | "fail" | "warning" | "info";

/**
 * Individual check result
 */
export interface CheckResult {
  criterion: string;
  name: string;
  level: WcagLevel;
  status: CheckStatus;
  value?: string | number | boolean;
  required?: string | number;
  message: string;
  recommendation?: string;
}

/**
 * WCAG criterion definition
 */
export interface WcagCriterion {
  id: string;
  name: string;
  level: WcagLevel;
  description: string;
  url: string;
  category?: string;
}

/**
 * Summary statistics for a validation report
 */
export interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  levelA: { passed: number; failed: number };
  levelAA: { passed: number; failed: number };
  levelAAA: { passed: number; failed: number };
}

/**
 * Machine-readable report format
 */
export interface MachineReport {
  wcagVersion: string;
  timestamp: string;
  category?: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  results: Array<{
    criterion: string;
    name: string;
    level: WcagLevel;
    status: CheckStatus;
    value?: string | number | boolean;
    required?: string | number;
    message: string;
    recommendation?: string;
    url?: string;
  }>;
}

/**
 * Complete validation report with human and machine formats
 */
export interface ValidationReport {
  summary: ReportSummary;
  results: CheckResult[];
  human: string;
  machine: MachineReport;
}

/**
 * MCP tool definition
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}
