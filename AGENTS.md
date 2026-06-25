# pfwr — Project Summary for Agents

## What It Does

**pfwr** is a CLI tool that converts Markdown files into self-contained HTML slide decks. A single Markdown file (slides separated by `---`) becomes a portable, interactive HTML presentation with no external runtime dependencies.

## Key Features

- CommonMark + GitHub-Flavored Markdown → HTML slides
- Fully self-contained output (CSS, JS, images all inlined)
- YAML frontmatter + per-slide HTML comment config
- Built-in themes: `default`, `funky`, `eco`
- Keyboard, touch (swipe), and mouse navigation
- Code syntax highlighting (Prism, bundled)
- Emoji support (Twemoji, bundled)
- Watch mode (`-w`) and auto-open in browser (`-o`)
- Printable to PDF via browser print

## Architecture

### Processing Pipeline

```
Input .md → remark-parse → custom remark plugins → remark-rehype → rehype plugins → HTML string
```

Built on the [unified](https://unifiedjs.com/) ecosystem (remark/rehype).

### Custom Remark Plugins (`src/remark/`)

| File | Role |
|---|---|
| `page-split.js` | Wraps content between `---` thematic breaks in `<section class="slide">` |
| `parse-comments.js` | Extracts `<!--config key=value -->` HTML comment markers |
| `auto-tag.js` | Converts YAML frontmatter + comment configs into `data-*` attributes on slides |

### Key Source Files

| Path | Role |
|---|---|
| `src/index.js` | Main export — composes the full unified pipeline |
| `bin/cli.js` | CLI entry point (argument parsing, file I/O, watch mode) |
| `bin/template.md` | Default template created when input file doesn't exist |
| `browser/pfwr.js` | Client-side slide navigation logic |
| `browser/index.js` | Browser init: hash routing, emoji, event binding |
| `browser/style.css` | All presentation styles + themes (CSS custom properties) |
| `dist/index.js` | Rollup bundle — what npm consumers import |

### Build

Rollup bundles `src/` → `dist/index.js`. Browser assets (CSS, JS) are embedded as strings via `rollup-plugin-string`, making the output self-contained.

## Stack

- **Runtime**: Node.js >= 20.12, ESM
- **Markdown**: unified, remark-parse, remark-gfm, remark-frontmatter, remark-emoji
- **HTML**: remark-rehype, rehype-document, rehype-meta, rehype-stringify
- **Browser**: vanilla JS, no framework
- **Build**: Rollup
- **Lint**: ESLint with `eslint-plugin-bpmn-io`

## Commands

```bash
npm run all           # lint + bundle + test (CI)
npm run bundle        # build dist/index.js
npm run dev           # watch all (lint, bundle, test)
npm test              # build example/presentation.html
```

```bash
pfwr input.md [output.html]   # convert
pfwr -w input.md              # watch mode
pfwr -o input.md              # open in browser after build
```

## Configuration

**Global** (YAML frontmatter):
```yaml
---
title: My Talk
author: Name
theme: funky
---
```

**Per-slide** (HTML comment):
```html
<!--config
theme=funky
align=right
-->
```

## Security Note

pfwr uses `allowDangerousHtml: true` — it embeds arbitrary HTML from Markdown. **Do not use with untrusted input.**

## Version

Current: `0.15.0` — latest addition is swipe navigation.
