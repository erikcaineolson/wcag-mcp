# WCAG Text Accessibility Check

Check text styles against WCAG 2.1 accessibility guidelines.

## Usage

```
/wcag <description of what to check>
/wcag <URL>
```

## Examples

- `/wcag check #333 on white at 16px`
- `/wcag validate my heading: 24px bold, #1a1a1a on #f5f5f5, line-height 32px`
- `/wcag is 14px gray (#666) text accessible on white?`
- `/wcag https://example.com`

---

When the user invokes this skill, determine if they provided a **URL** or a **manual style description**.

## Mode 1: URL Analysis

If the input is a URL (starts with `http://` or `https://`):

1. **Navigate to the page** using `mcp__plugin_playwright_playwright__browser_navigate`

2. **Extract text styles** using `mcp__plugin_playwright_playwright__browser_evaluate` with this function:
   ```javascript
   () => {
     const samples = [];
     const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li, td, th, label, button');
     const seen = new Set();

     for (const el of elements) {
       if (!el.textContent.trim()) continue;
       const style = window.getComputedStyle(el);
       const bg = getBackgroundColor(el);
       const key = `${style.color}|${bg}|${Math.round(parseFloat(style.fontSize))}|${style.fontWeight}`;
       if (seen.has(key)) continue;
       seen.add(key);

       samples.push({
         tag: el.tagName.toLowerCase(),
         text: el.textContent.trim().slice(0, 50),
         color: style.color,
         backgroundColor: bg,
         fontSize: parseFloat(style.fontSize),
         fontWeight: style.fontWeight,
         lineHeight: parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2,
         letterSpacing: parseFloat(style.letterSpacing) || 0,
         wordSpacing: parseFloat(style.wordSpacing) || 0
       });
       if (samples.length >= 20) break;
     }

     function getBackgroundColor(el) {
       let current = el;
       while (current) {
         const bg = window.getComputedStyle(current).backgroundColor;
         if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
         current = current.parentElement;
       }
       return 'rgb(255, 255, 255)';
     }

     return samples;
   }
   ```

3. **Check each unique style combination** using the wcag-text MCP tools:
   - Convert RGB colors to hex format
   - Use `mcp__wcag-text__check_contrast` for each foreground/background pair

4. **Test text spacing resilience (WCAG 1.4.12)** - This is the actual requirement: pages must not break when users apply custom spacing. Use `mcp__plugin_playwright_playwright__browser_evaluate` to inject WCAG spacing and detect layout issues:
   ```javascript
   () => {
     // Inject WCAG-compliant spacing via CSS
     const style = document.createElement('style');
     style.id = 'wcag-spacing-test';
     style.textContent = `
       * {
         line-height: 1.5 !important;
         letter-spacing: 0.12em !important;
         word-spacing: 0.16em !important;
       }
       p { margin-bottom: 2em !important; }
     `;
     document.head.appendChild(style);

     // Wait for reflow
     document.body.offsetHeight;

     // Detect layout issues
     const issues = [];
     const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li, td, th, label, button, div');

     for (const el of elements) {
       if (!el.textContent.trim()) continue;
       const rect = el.getBoundingClientRect();
       if (rect.width === 0 || rect.height === 0) continue;

       const style = window.getComputedStyle(el);

       // Check for text overflow/clipping
       if (el.scrollWidth > el.clientWidth && style.overflowX === 'hidden') {
         issues.push({
           type: 'horizontal-clip',
           tag: el.tagName.toLowerCase(),
           text: el.textContent.trim().slice(0, 30),
           selector: getSelector(el)
         });
       }

       if (el.scrollHeight > el.clientHeight && style.overflowY === 'hidden') {
         issues.push({
           type: 'vertical-clip',
           tag: el.tagName.toLowerCase(),
           text: el.textContent.trim().slice(0, 30),
           selector: getSelector(el)
         });
       }

       // Check for text-overflow: ellipsis being triggered
       if (style.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth) {
         issues.push({
           type: 'ellipsis-triggered',
           tag: el.tagName.toLowerCase(),
           text: el.textContent.trim().slice(0, 30),
           selector: getSelector(el)
         });
       }
     }

     // Check for overlapping elements (sample check)
     const textEls = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button, label')).slice(0, 20);
     for (let i = 0; i < textEls.length; i++) {
       for (let j = i + 1; j < textEls.length; j++) {
         const r1 = textEls[i].getBoundingClientRect();
         const r2 = textEls[j].getBoundingClientRect();
         if (r1.width === 0 || r2.width === 0) continue;

         const overlap = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
         if (overlap && !textEls[i].contains(textEls[j]) && !textEls[j].contains(textEls[i])) {
           issues.push({
             type: 'overlap',
             elements: [
               { tag: textEls[i].tagName.toLowerCase(), text: textEls[i].textContent.trim().slice(0, 20) },
               { tag: textEls[j].tagName.toLowerCase(), text: textEls[j].textContent.trim().slice(0, 20) }
             ]
           });
         }
       }
     }

     // Clean up
     document.getElementById('wcag-spacing-test')?.remove();

     function getSelector(el) {
       if (el.id) return '#' + el.id;
       if (el.className) return el.tagName.toLowerCase() + '.' + el.className.split(' ')[0];
       return el.tagName.toLowerCase();
     }

     return {
       issueCount: issues.length,
       issues: issues.slice(0, 10),
       passed: issues.length === 0
     };
   }
   ```

5. **Close the browser** using `mcp__plugin_playwright_playwright__browser_close`

6. **Present a comprehensive report** organized by:
   - Summary: total elements checked, pass/fail counts
   - Contrast results: pass/fail for each color combination
   - Text spacing resilience: whether the layout survived WCAG spacing injection
     - If issues found: list clipped text, ellipsis triggers, overlapping elements
     - Include CSS selectors so developers can fix the issues
   - Recommendations for fixing any failures

## Mode 2: Manual Style Check

If the input describes styles manually (colors, font sizes, etc.):

Parse the user's request to extract:
- **Colors**: foreground/text color and background color (hex, rgb, named colors)
- **Font size**: in pixels (default 16px if not specified)
- **Font weight**: bold or normal
- **Spacing**: line-height, letter-spacing, word-spacing if mentioned
- **Sample text**: if they provide text to check line length

Then call the appropriate tool:
- For simple color checks: use `mcp__wcag-text__check_contrast`
- For spacing validation: use `mcp__wcag-text__check_text_spacing`
- For comprehensive checks: use `mcp__wcag-text__validate_text`

## Output Format

Present results clearly:
- ✓ for items that PASSED
- ✗ for items that FAILED
- Include specific WCAG criterion references (e.g., "1.4.3 Contrast (Minimum)")
- Provide actionable recommendations for fixing failures

If the user's input is ambiguous, ask clarifying questions.

User input: $ARGUMENTS
