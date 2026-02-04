import type { CheckResult, ValidationReport, WcagLevel, MachineReport } from "./types.js";
import { getCriterion } from "./criteria.js";

/**
 * Format results into a human-readable report
 */
export function formatHumanReport(results: CheckResult[], title?: string): string {
  const lines: string[] = [];
  const reportTitle = title ?? "WCAG ACCESSIBILITY REPORT";

  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push(`                    ${reportTitle.toUpperCase()}              `);
  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push("");

  const passed = results.filter(r => r.status === "pass");
  const failed = results.filter(r => r.status === "fail");
  const warnings = results.filter(r => r.status === "warning");
  const info = results.filter(r => r.status === "info");

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

  // Info
  if (info.length > 0) {
    lines.push("ℹ️  INFO");
    lines.push("───────────────────────────────────────────────────────────────");
    for (const r of info) {
      lines.push(`[${r.criterion}] ${r.name} (Level ${r.level}): ${r.message}`);
    }
    lines.push("");
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

/**
 * Create machine-readable report format
 */
export function formatMachineReport(results: CheckResult[], category?: string): MachineReport {
  const passed = results.filter(r => r.status === "pass");
  const failed = results.filter(r => r.status === "fail");
  const warnings = results.filter(r => r.status === "warning");

  return {
    wcagVersion: "2.1",
    timestamp: new Date().toISOString(),
    category,
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
      url: getCriterion(r.criterion)?.url,
    })),
  };
}

/**
 * Create a complete validation report from check results
 */
export function createReport(results: CheckResult[], options?: {
  title?: string;
  category?: string;
}): ValidationReport {
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
    human: formatHumanReport(results, options?.title),
    machine: formatMachineReport(results, options?.category),
  };
}

/**
 * Format a validation report for MCP tool response
 */
export function formatToolResponse(report: ValidationReport): Array<{ type: "text"; text: string }> {
  return [
    { type: "text", text: report.human },
    { type: "text", text: "\n\nMACHINE-READABLE:\n" + JSON.stringify(report.machine, null, 2) },
  ];
}

/**
 * Create an error response for MCP tools
 */
export function formatErrorResponse(error: unknown): {
  content: Array<{ type: "text"; text: string }>;
  isError: true;
} {
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true,
  };
}
