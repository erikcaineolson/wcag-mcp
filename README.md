# WCAG Text MCP Server

MCP server for comprehensive WCAG 2.1 text accessibility validation. Returns both human-readable reports and machine-readable JSON.

## Authors

- Erik Olson ([@erikcaineolson](https://github.com/erikcaineolson))
- Claude Opus 4.5 (AI pair programmer)

## WCAG Criteria Covered

| Criterion | Level | What it checks |
|-----------|-------|----------------|
| 1.4.3 | AA | Contrast ratio ≥4.5:1 (3:1 for large text) |
| 1.4.4 | AA | Text can resize to 200% |
| 1.4.5 | AA | Use real text, not images of text |
| 1.4.6 | AAA | Contrast ratio ≥7:1 (4.5:1 for large text) |
| 1.4.8 | AAA | Line length ≤80 chars, no justify |
| 1.4.10 | AA | Content reflows at 400% zoom |
| 1.4.12 | AA | Supports custom spacing (line-height ≥1.5×, etc.) |
| 3.1.1 | A | Page has lang attribute |
| 3.1.2 | AA | Language changes are marked |

## Tools

| Tool | Description |
|------|-------------|
| `check_contrast` | Color contrast ratio validation |
| `check_text_spacing` | Line-height, letter/word/paragraph spacing |
| `check_line_length` | Max 80 characters per line |
| `check_language` | Page language attribute |
| `validate_text` | Comprehensive validation of all criteria |
| `get_wcag_text_criteria` | Reference information for all criteria |

## Output Format

All tools return dual-format output:

1. **Human-readable report** with pass/fail/warning symbols
2. **Machine-readable JSON** with structured results

Example output:
```
═══════════════════════════════════════════════════════════════
                    WCAG TEXT ACCESSIBILITY REPORT
═══════════════════════════════════════════════════════════════

SUMMARY: 3 passed, 1 failed, 1 warnings

❌ FAILURES
───────────────────────────────────────────────────────────────
[1.4.12] Text Spacing (Level AA)
   Line height: 18px < 21.0px (1.5× font size) ✗
   → Ensure text remains readable when users apply custom spacing

✅ PASSED
───────────────────────────────────────────────────────────────
[1.4.3] Contrast (Minimum) (Level AA): Contrast ratio 7.46:1 meets AA
```

## Installation

### Build from Source

```bash
git clone https://github.com/erikcaineolson/wcag-text-mcp.git
cd wcag-text-mcp
npm install
npm run build
```

### As MCP Server

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "wcag-text": {
      "command": "node",
      "args": ["/path/to/wcag-text-mcp/dist/index.js"]
    }
  }
}
```

### Claude Code Skill

Copy `skill/SKILL.md` to `~/.claude/skills/wcag/SKILL.md` to enable the `/wcag` command:

```bash
mkdir -p ~/.claude/skills/wcag
cp skill/SKILL.md ~/.claude/skills/wcag/
```

Then use:
```
/wcag check #333 on white at 16px
/wcag validate 14px #666 on #fff with 24px line-height
/wcag https://example.com
```

## URL Analysis Mode

When given a URL, the skill will:
1. Navigate to the page using Playwright
2. Extract all text styles (colors, fonts, spacing)
3. Check contrast ratios for each unique style combination
4. Test text spacing resilience by injecting WCAG-compliant spacing
5. Detect layout issues (clipping, overlaps, ellipsis triggers)
6. Generate a comprehensive accessibility report

## Requirements Reference

### Contrast (1.4.3, 1.4.6)
- Normal text: 4.5:1 (AA), 7:1 (AAA)
- Large text (≥18pt or ≥14pt bold): 3:1 (AA), 4.5:1 (AAA)

### Text Spacing (1.4.12)
Content must remain functional when users apply:
- Line height ≥ 1.5× font size
- Paragraph spacing ≥ 2× font size
- Letter spacing ≥ 0.12× font size
- Word spacing ≥ 0.16× font size

### Visual Presentation (1.4.8)
- Maximum 80 characters per line
- Text not fully justified
- Foreground/background colors can be selected by user

## License

MIT
