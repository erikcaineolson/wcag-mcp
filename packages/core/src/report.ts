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
 * Format a validation report as a Markdown document
 */
export function formatMarkdownReport(report: ValidationReport, options?: {
  title?: string;
  url?: string;
  notes?: string;
}): string {
  const lines: string[] = [];
  const title = options?.title ?? "WCAG Accessibility Report";
  const timestamp = report.machine.timestamp;
  const date = timestamp.split("T")[0];

  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`**Date:** ${date}  `);
  lines.push(`**WCAG Version:** ${report.machine.wcagVersion}  `);
  if (report.machine.category) {
    lines.push(`**Category:** ${report.machine.category}  `);
  }
  if (options?.url) {
    lines.push(`**URL:** ${options.url}  `);
  }
  lines.push("");

  // Summary
  const s = report.summary;
  lines.push("## Summary");
  lines.push("");
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total checks | ${s.total} |`);
  lines.push(`| Passed | ${s.passed} |`);
  lines.push(`| Failed | ${s.failed} |`);
  lines.push(`| Warnings | ${s.warnings} |`);
  lines.push("");

  lines.push("### By Level");
  lines.push("");
  lines.push(`| Level | Passed | Failed |`);
  lines.push(`|-------|--------|--------|`);
  lines.push(`| A | ${s.levelA.passed} | ${s.levelA.failed} |`);
  lines.push(`| AA | ${s.levelAA.passed} | ${s.levelAA.failed} |`);
  lines.push(`| AAA | ${s.levelAAA.passed} | ${s.levelAAA.failed} |`);
  lines.push("");

  const failed = report.results.filter(r => r.status === "fail");
  const warnings = report.results.filter(r => r.status === "warning");
  const passed = report.results.filter(r => r.status === "pass");
  const info = report.results.filter(r => r.status === "info");

  // Failures
  if (failed.length > 0) {
    lines.push("## Failures");
    lines.push("");
    for (const r of failed) {
      const criterion = getCriterion(r.criterion);
      const url = criterion?.url ?? "";
      lines.push(`### [${r.criterion}] ${r.name} (Level ${r.level})`);
      lines.push("");
      lines.push(`${r.message}`);
      if (r.value !== undefined) {
        lines.push(`- **Value:** ${r.value}`);
      }
      if (r.required !== undefined) {
        lines.push(`- **Required:** ${r.required}`);
      }
      if (r.recommendation) {
        lines.push(`- **Recommendation:** ${r.recommendation}`);
      }
      if (url) {
        lines.push(`- **Reference:** [WCAG ${r.criterion}](${url})`);
      }
      lines.push("");
    }
  }

  // Warnings
  if (warnings.length > 0) {
    lines.push("## Warnings");
    lines.push("");
    for (const r of warnings) {
      const criterion = getCriterion(r.criterion);
      const url = criterion?.url ?? "";
      lines.push(`### [${r.criterion}] ${r.name} (Level ${r.level})`);
      lines.push("");
      lines.push(`${r.message}`);
      if (r.recommendation) {
        lines.push(`- **Recommendation:** ${r.recommendation}`);
      }
      if (url) {
        lines.push(`- **Reference:** [WCAG ${r.criterion}](${url})`);
      }
      lines.push("");
    }
  }

  // Passed
  if (passed.length > 0) {
    lines.push("## Passed");
    lines.push("");
    for (const r of passed) {
      lines.push(`- **[${r.criterion}] ${r.name}** (Level ${r.level}) — ${r.message}`);
    }
    lines.push("");
  }

  // Info
  if (info.length > 0) {
    lines.push("## Info");
    lines.push("");
    for (const r of info) {
      lines.push(`- **[${r.criterion}] ${r.name}** (Level ${r.level}) — ${r.message}`);
    }
    lines.push("");
  }

  // Notes
  if (options?.notes) {
    lines.push("## Notes");
    lines.push("");
    lines.push(options.notes);
    lines.push("");
  }

  lines.push("---");
  lines.push(`*Generated by WCAG MCP Server Suite*`);
  lines.push("");

  return lines.join("\n");
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
