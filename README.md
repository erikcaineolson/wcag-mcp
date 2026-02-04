# WCAG MCP Server Suite

A modular suite of MCP (Model Context Protocol) servers for WCAG 2.1 accessibility validation.

## Architecture

This monorepo contains individual focused servers plus an umbrella server for full WCAG coverage:

```
packages/
├── core/       # Shared types, criteria definitions, report formatting
├── text/       # Text accessibility (contrast, spacing, language) ✅
├── keyboard/   # Keyboard navigation and focus (2.1.x, 2.4.x) ✅
├── aria/       # ARIA roles, states, properties (4.1.x) ✅
├── media/      # Captions, audio descriptions (1.2.x) ✅
├── forms/      # Labels, error handling (1.3.x, 3.3.x) ✅
├── structure/  # Headings, landmarks, reading order (1.3.x, 2.4.x) ✅
└── full/       # Umbrella combining all servers ✅
```

## Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Or build individually
npm run build:core
npm run build:text
npm run build:keyboard
# etc.
```

## Packages

### @wcag-mcp/core

Shared library with:
- TypeScript types for check results, reports, criteria
- Complete WCAG 2.1 criteria definitions (78 criteria) with categories
- Report formatting utilities (human-readable and machine-readable)

### @wcag-mcp/text

Text accessibility validation.

**WCAG Criteria:** 1.4.3, 1.4.4, 1.4.5, 1.4.6, 1.4.8, 1.4.10, 1.4.12, 3.1.1, 3.1.2

**Tools:**
- `check_contrast` - Color contrast ratio (AA/AAA)
- `check_text_spacing` - Line-height, letter/word spacing
- `check_line_length` - Max 80 characters (AAA)
- `check_language` - Page lang attribute
- `validate_text` - Comprehensive text validation
- `get_wcag_text_criteria` - Reference data

### @wcag-mcp/keyboard

Keyboard and pointer accessibility validation.

**WCAG Criteria:** 2.1.1, 2.1.2, 2.1.4, 2.2.1, 2.2.3, 2.4.3, 2.4.7, 2.5.1, 2.5.2, 2.5.4, 2.5.5, 3.2.1

**Tools:**
- `check_keyboard_access` - Keyboard operability, focus trapping
- `check_focus_indicator` - Focus visibility and contrast
- `check_timing` - Time limit adjustability
- `check_motion` - Motion actuation controls
- `check_pointer_gestures` - Complex gesture alternatives
- `check_pointer_cancellation` - Down-event cancellation
- `check_target_size` - Touch target dimensions
- `get_wcag_keyboard_criteria` - Reference data

### @wcag-mcp/aria

ARIA and semantic accessibility validation.

**WCAG Criteria:** 2.5.3, 4.1.1, 4.1.2, 4.1.3

**Tools:**
- `check_name_role_value` - Accessible names, roles, states
- `check_status_message` - Live region announcements
- `check_aria_attributes` - ARIA attribute validity
- `check_landmarks` - Landmark region labeling
- `check_label_in_name` - Visible label in accessible name
- `get_wcag_aria_criteria` - Reference data

### @wcag-mcp/media

Media accessibility validation.

**WCAG Criteria:** 1.2.1-1.2.9, 1.4.2, 2.2.2, 2.3.1, 2.3.2, 2.3.3

**Tools:**
- `check_captions` - Caption availability (prerecorded/live)
- `check_audio_description` - Audio description for video
- `check_transcript` - Text alternatives for media
- `check_media_controls` - Autoplay control mechanisms
- `check_animation` - Animation pause/stop controls
- `check_flashing` - Flash frequency thresholds
- `check_sign_language` - Sign language interpretation
- `get_wcag_media_criteria` - Reference data

### @wcag-mcp/forms

Form accessibility validation.

**WCAG Criteria:** 1.3.5, 3.2.2, 3.3.1-3.3.6

**Tools:**
- `check_form_labels` - Label associations
- `check_input_purpose` - Autocomplete attributes
- `check_error_identification` - Error messaging
- `check_error_prevention` - Submission safeguards
- `check_input_constraints` - Format instructions
- `check_on_input` - Context change on input
- `validate_form` - Comprehensive form validation
- `get_wcag_forms_criteria` - Reference data

### @wcag-mcp/structure

Page structure and navigation validation.

**WCAG Criteria:** 1.3.1, 1.3.2, 2.4.1, 2.4.2, 2.4.4, 2.4.5, 2.4.6, 2.4.9, 2.4.10, 3.2.3, 3.2.4

**Tools:**
- `check_heading_structure` - Heading hierarchy
- `check_page_title` - Title descriptiveness
- `check_link_purpose` - Link text clarity
- `check_bypass_blocks` - Skip links, landmarks
- `check_reading_order` - DOM/visual order match
- `check_info_relationships` - Semantic structure
- `check_multiple_ways` - Navigation methods
- `check_consistent_navigation` - Navigation consistency
- `check_consistent_identification` - Component labeling
- `get_wcag_structure_criteria` - Reference data

### @wcag-mcp/full

Umbrella server with overview tools.

**Tools:**
- `get_all_wcag_criteria` - All criteria filtered by level/category
- `get_wcag_checklist` - Conformance level checklist
- `wcag_help` - Usage help

## Usage with Claude Code

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "wcag-text": {
      "command": "node",
      "args": ["/path/to/wcag-mcp/packages/text/dist/index.js"]
    },
    "wcag-keyboard": {
      "command": "node",
      "args": ["/path/to/wcag-mcp/packages/keyboard/dist/index.js"]
    },
    "wcag-aria": {
      "command": "node",
      "args": ["/path/to/wcag-mcp/packages/aria/dist/index.js"]
    },
    "wcag-media": {
      "command": "node",
      "args": ["/path/to/wcag-mcp/packages/media/dist/index.js"]
    },
    "wcag-forms": {
      "command": "node",
      "args": ["/path/to/wcag-mcp/packages/forms/dist/index.js"]
    },
    "wcag-structure": {
      "command": "node",
      "args": ["/path/to/wcag-mcp/packages/structure/dist/index.js"]
    }
  }
}
```

Or use the umbrella server:

```json
{
  "mcpServers": {
    "wcag": {
      "command": "node",
      "args": ["/path/to/wcag-mcp/packages/full/dist/index.js"]
    }
  }
}
```

## Development

```bash
# Watch mode for development
cd packages/text && npm run dev

# Build all
npm run build

# Clean all dist folders
npm run clean
```

## Adding New Checks

Import shared utilities from `@wcag-mcp/core`:

```typescript
import {
  createReport,
  formatToolResponse,
  getCriteriaByCategory,
  type CheckResult
} from "@wcag-mcp/core";

// Get criteria for a category
const criteria = getCriteriaByCategory("keyboard");

// Create a check result
const result: CheckResult = {
  criterion: "2.1.1",
  name: "Keyboard",
  level: "A",
  status: "pass",
  message: "All functionality is keyboard accessible"
};

// Create formatted report
const report = createReport([result], {
  title: "My Check",
  category: "keyboard"
});
```

## License

MIT
