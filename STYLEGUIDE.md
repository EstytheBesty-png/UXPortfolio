# UX Portfolio Style Guide

This document defines the visual language, naming conventions, and front-end practices used in this portfolio project. It is intended to keep the design consistent, maintainable, and easy to extend as new pages or case studies are added.

## 1. Design Principles

- Keep the portfolio calm, editorial, and tactile.
- Use a notebook-inspired visual system to reinforce the storytelling format.
- Prioritize readability and accessibility over decorative complexity.
- Maintain a consistent page rhythm across all sections.
- Use subtle motion and shadow only to support hierarchy, not to distract.

## 2. Visual System

### 2.1 Color Palette

| Token | Hex | Purpose |
| --- | --- | --- |
| Notebook background | #EEF8DF | Main page background |
| Deep forest green | #26382F | Main body text |
| Muted brown | #423022 | Sidebar tab text |
| Warm paper | #F8F1E7 | Notebook-like content surfaces |
| Sage green | #BDE38F | Case study accent |
| Rose pink | #FFAFC0 | Action/section accent |
| Sky blue | #97D2FF | Feature accent |
| Peach | #FFBD89 | Hobbies/creative accent |
| Lilac | #CFB4FF | Contact accent |
| Muted parchment | #F4E9D7 | Light emphasis areas |

Use these as the primary tokens; avoid ad hoc colors unless the content calls for a special highlight or an image treatment.

### 2.2 Typography

- Primary serif: Georgia, "Times New Roman", serif
- Notebook headings: "Cormorant Garamond", Garamond, Georgia, serif
- Script accents: "Petit Formal Script", cursive

Recommended hierarchy:

- h1 / page title: large editorial serif, refined and expressive
- h2: consistent page section heading across all pages
- h3: subheading for project structure and section labels
- body: readable serif or neutral serif for long-form text

Use consistent spacing between headings and paragraphs to preserve the notebook reading rhythm.

### 2.3 Spacing Scale

Use a simple 4px-based rhythm:

- 4px: micro spacing
- 8px: compact spacing
- 12px: default internal spacing
- 16px: standard content gap
- 24px: card and section separation
- 32px: major layout spacing
- 48px+: page-level rhythm and large gaps

Keep vertical spacing consistent across pages to maintain the editorial look.

## 3. Layout Patterns

### 3.1 Notebook Layout

- Main portfolio uses a fixed book composition with two-page spread logic.
- The book sits centered within the viewport.
- Side tabs appear only after the notebook has opened.
- Each page has a visible page number in the lower-right corner.
- The footer line is reserved for the copyright text and remains consistent across pages.

### 3.2 Case Study Pages

- Content should flow in a clear sequence: heading, paragraph, subheading, image or supporting visual.
- Match the same image treatment across project pages: bordered image, subtle shadow, zoom-in affordance.
- Keep text blocks readable and avoid maximum paragraph widths that feel crowded.
- Use a compact grid for supporting visual assets where needed.

### 3.3 Table of Contents

- TOC entries should have a clear label and page number aligned to the right.
- Links should visually resemble the rest of the portfolio, without excessive underline styling.
- The page label and page index should remain easy to scan at a glance.

## 4. Component and Code Conventions

### 4.1 React Structure

- Keep page content in a single main component structure for the portfolio notebook.
- Use `const` definitions for fixed data such as `NOTEBOOK_TABS` and `TOC_ITEMS`.
- Prefer descriptive names like `handleTabJump`, `openLightbox`, and `closeLightbox`.
- Keep logic and layout close to the content it controls.

### 4.2 CSS Naming

Use naming that reflects purpose rather than presentational shortcuts.

Preferred patterns:

- `book-container`
- `sideTab`
- `wartekorbChallengePage`
- `tocLink`
- `pageFourImageGrid`

Avoid vague names such as `div1`, `box`, or `special`.

### 4.3 CSS Organization

Keep styles grouped in a predictable order:

1. Global resets and base styles
2. Layout shell and page frame
3. Typography styles
4. Navigation and side tabs
5. Content-specific styling for pages and case studies
6. Responsive rules and media queries
7. State/focus/interaction refinements

This keeps styling easy to scan and maintain.

## 5. Accessibility

- Ensure every interactive element is keyboard accessible.
- Use semantic buttons for clickable UI and actions.
- Provide aria-labels for images opened in lightbox dialogs.
- Ensure focus styles remain visible and clear.
- Preserve readable contrast ratios for text and controls.
- Add alt text that is specific and meaningful.

## 6. Interaction Patterns

### 6.1 Lightbox

- Images that require close inspection should open in a dialog overlay.
- Clicking outside the image should close it.
- Escape should also close the lightbox.
- Focus should move into the lightbox and return afterwards.

### 6.2 Book Navigation

- Book actions should be clear and predictable.
- Tabs and TOC items should jump to the intended page index.
- Navigation state should remain consistent when switching pages.

## 7. Asset Handling

- Store project assets in `public/assets`.
- Keep filenames readable and descriptive, for example `Crazy 8 Sketches.png` or `Wartekorb app image.png`.
- Use consistent file naming conventions across sections.
- Avoid unnecessary version strings in paths unless required for cache busting.

## 8. Practical Coding Rules

- Prefer small, readable blocks of JSX and CSS.
- Keep content data separate from UI logic when it becomes reusable.
- Avoid hardcoding repeated strings where a shared constant or data object can be used.
- Use consistent indentation and spacing.
- Keep comments focused on intent, not obvious details.
- Validate the build after major changes before finalizing work.

## 9. Example Pattern

```jsx
const TOC_ITEMS = [
  { label: "Intro", pageIndex: 1, pageNumber: 1 },
  { label: "Wartekorb", pageIndex: 3, pageNumber: 3 },
  { label: "Contact", pageIndex: 10, pageNumber: 10 },
];
```

```css
.wartekorbChallengeTitle {
  margin: 0;
  font-family: "Cormorant Garamond", Garamond, Georgia, serif;
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  line-height: 1.12;
}
```

## 10. Review Checklist

Before finalizing a page or feature, check:

- Did the content fit the notebook structure?
- Are the section headings visually consistent?
- Is the image treatment aligned with the rest of the portfolio?
- Do TOC and side-tab links lead to the right page?
- Is the layout still readable on smaller screens?
- Did accessibility checks pass for focus and labeling?
- Did the build succeed after the changes?

This style guide should be used as the baseline for design and implementation decisions throughout the project.
