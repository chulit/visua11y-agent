# Visua11y Agent: Universal Accessibility Website Widget

<p align="center">
  <img src="./src/icons/logo.webp" alt="Visua11y Agent - Web Accessibility Widget Logo" width="180">
</p>

<p align="center">
  <strong>⚡ Zero-dependency Universal Accessibility (a11y) Toolbar for WCAG 2.1 & ADA Website Compliance</strong>
</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/visua11y-agent.svg)](https://www.npmjs.com/package/visua11y-agent)
[![npm downloads](https://img.shields.io/npm/dm/visua11y-agent.svg)](https://www.npmjs.com/package/visua11y-agent)
[![bundle size](https://img.shields.io/bundlephobia/minzip/visua11y-agent)](https://bundlephobia.com/package/visua11y-agent)
[![GitHub release](https://img.shields.io/github/v/release/chulit/visua11y-agent)](https://github.com/chulit/visua11y-agent/releases)
[![GitHub issues](https://img.shields.io/github/issues/chulit/visua11y-agent)](https://github.com/chulit/visua11y-agent/issues)
[![GitHub license](https://img.shields.io/github/license/chulit/visua11y-agent)](https://github.com/chulit/visua11y-agent/blob/master/LICENSE)

</div>

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Live Demo & Documentation](#live-demo--documentation)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Universal Usage](#universal-usage)
- [Configuration](#configuration)
- [Accessibility Profiles](#preset-profiles)
- [Features](#features)
- [Local Development](#local-development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Visua11y Agent adds an enterprise-grade, customizable accessibility toolbar to any website. Visitors can adjust contrast, typography, color blindness simulation, audio screen reader, and voice navigation on demand. Built with zero runtime dependencies, full TypeScript types, and root-level DOM isolation.

## Project Structure

The project is organized under `src/`:

- **`components/`**: UI components for the floating trigger widget, accessibility menu panel, and language drawers.
- **`config/`**: Configuration definitions for the plugin, user presets, and accessibility profiles.
- **`core/`**: Core orchestrator and bootstrapping engine.
- **`enum/`**: Enumerations for positions, sizes, color blindness types, and filters.
- **`i18n/`**: Internationalization engine with auto-detection of `html[lang]` and dynamic locale loader.
- **`icons/`**: Optimized SVG and WebP vector iconography.
- **`locales/`**: 53 JSON translation files covering global languages.
- **`storage/`**: State management with `localStorage` and cookie persistence fallbacks.
- **`tools/`**: Accessibility tool implementations (font scaling, line height, letter spacing, dyslexia fonts, SVG color blindness matrices, contrast modes, reading guide, speech synthesizers).
- **`types/`**: TypeScript type definitions and interfaces.
- **`utils/`**: Utilities for focus trapping, DOM styling, stylesheet injection, and script attribute parsing.

## Live Demo & Documentation

- **Documentation & Guides**: [chulit.github.io/visua11y-agent](https://chulit.github.io/visua11y-agent)
- **Live Interactive Demo**: [chulit.github.io/visua11y-agent/demo/](https://chulit.github.io/visua11y-agent/demo/)
- **Demo Source**: Review the demo markup inside `demo/index.html`

## Installation

### Option A — npm / yarn / pnpm

```bash
npm install visua11y-agent
```

Import the standard full bundle or the ultra-lightweight slim bundle (with on-demand locale fetching):

```js
// Full bundle (all 53 locales pre-bundled)
import 'visua11y-agent';

// OR Slim bundle (locales fetched on-demand)
import 'visua11y-agent/slim';
```

### Option B — CDN (Script Tag)

Every release is published to npm, accessible via major global CDNs:

- **jsDelivr (UMD)** — `https://cdn.jsdelivr.net/npm/visua11y-agent@1.8.0/dist/visua11y-agent.umd.js`
- **unpkg (UMD)** — `https://unpkg.com/visua11y-agent@1.8.0/dist/visua11y-agent.umd.js`
- **esm.sh (ESM)** — `https://esm.sh/visua11y-agent`

```html
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent@1.8.0/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="en"
  data-visua11y-agent-position="bottom-right"
  data-visua11y-agent-offset="24,24"
  defer
></script>
```

## Quick Start

```html
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent@1.8.0/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="en"
  data-visua11y-agent-position="bottom-right"
  data-visua11y-agent-offset="24,24"
  data-visua11y-agent-languages="en,id,es,fr,de"
  defer
></script>
```

## Universal Usage

Visua11y Agent supports modern module APIs and direct programmatic control:

### Modern ES Module (Recommended)

```js
import { createVisua11yAgent } from 'visua11y-agent';

const plugin = createVisua11yAgent({
  lang: 'en',
  position: 'bottom-right',
  offset: [24, 24],
  languages: ['en', 'id', 'es', 'fr', 'ja'], // Whitelist allowed languages
  size: 'medium',                            // Overall widget size ('small' | 'medium' | 'default')
  buttonSize: 52,                            // Custom trigger button diameter (px)
  iconSize: 28                               // Custom icon size (px)
});

// Programmatic control
plugin.openMenu();
plugin.setProfile('color-blind');
plugin.changeLanguage('id');
```

### Vue 3 / React / Next.js / Nuxt

```js
import { onMounted } from 'vue';
import { createVisua11yAgent } from 'visua11y-agent';

onMounted(() => {
  const agent = createVisua11yAgent({
    lang: 'en',
    position: 'bottom-right'
  });
});
```

See the [Documentation Guides](https://chulit.github.io/visua11y-agent/guide/universal-usage) for React Hooks, Vue Composables, Pinia stores, and Next.js SSR-safe integration patterns.

## Configuration

Control the widget via `data-visua11y-agent-*` script attributes or programmatically via the `createVisua11yAgent()` options object.

### JavaScript Options Reference (NPM / Frameworks)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`lang`** | `string` | `'en'` | Default interface language code (e.g. `'id'`, `'en'`, `'es'`). |
| **`languages`** | `string[]` \| `string` | `undefined` (All 53) | **Language Whitelist**: Array or comma-separated list of allowed languages (e.g. `['id', 'en']` or `'id,en'`). |
| **`position`** | `string` | `'bottom-left'` | Launcher floating button position (`'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`, `'center-right'`, `'center-left'`, `'bottom-center'`, `'top-center'`). |
| **`offset`** | `number[]` \| `string` | `[20, 20]` | Margin distance `[X, Y]` in pixels from the edge of the viewport. |
| **`size`** | `string` \| `number` | `'default'` | Widget/drawer size preset: `'small'`, `'medium'`, `'default'` / `'large'`. |
| **`buttonSize`** | `number` | `58` | Explicit launcher button diameter in pixels (e.g. `48`, `56`, `64`). |
| **`icon`** | `string` | SVG icon | Custom launcher button icon: SVG string, image URL, or template selector (e.g. `'#my-icon'`). |

### Script Attributes

| Attribute | Description | Example |
| :--- | :--- | :--- |
| `data-visua11y-agent-lang` | Default UI language code (53 supported). | `data-visua11y-agent-lang="en"` |
| `data-visua11y-agent-languages` | Whitelist allowed languages (comma-separated). Auto-hides language picker if single language. | `data-visua11y-agent-languages="en,id,es"` |
| `data-visua11y-agent-position` | Widget trigger position (`bottom-right`, `bottom-left`, `top-right`, `top-left`, etc.). | `data-visua11y-agent-position="bottom-right"` |
| `data-visua11y-agent-offset` | Trigger offset coordinates `x,y` (px). | `data-visua11y-agent-offset="24,24"` |
| `data-visua11y-agent-size` | Overall widget size (`small`, `medium`, `default`). | `data-visua11y-agent-size="medium"` |
| `data-visua11y-agent-icon` | Custom HTML markup for the launcher icon. | `data-visua11y-agent-icon="<span>♿️</span>"` |

### Preset Profiles

Eight WCAG/ADA accessibility presets stored in `localStorage` for instant activation:

| Profile | Key Adjustments |
| :--- | :--- |
| `Motor Impaired` | Big cursor, voice navigation, stop animations, +10% font size. |
| `Blind` | High contrast, screen reader helper, voice navigation, +15% font size. |
| `Color Blind` | True Protanopia optical filter matrix, dyslexia font, highlight links. |
| `Dyslexia` | OpenDyslexic typeface, extra letter spacing, increased line height, bolder weights. |
| `Low Vision` | 130% font scale, dark contrast, readable font, oversized cursor. |
| `Cognitive & Learning` | Highlight titles & links, reading guide overlay, voice navigation. |
| `Seizure & Epileptic` | Stops all CSS/GIF animations, low saturation, desaturated media. |
| `ADHD` | Reading guide focus overlay, highlight titles/links, calming contrast. |

### JavaScript Helpers & API

| Method | Description | Example |
| :--- | :--- | :--- |
| `plugin.openMenu()` | Open accessibility menu panel. | `plugin.openMenu()` |
| `plugin.closeMenu()` | Close accessibility menu panel. | `plugin.closeMenu()` |
| `plugin.toggleMenu()` | Toggle menu panel visibility. | `plugin.toggleMenu()` |
| `plugin.changeLanguage(code)` | Switch UI language at runtime. | `plugin.changeLanguage("id")` |
| `plugin.registerLanguage(opts)` | Register dynamic translations on the fly. | `plugin.registerLanguage({ code: "id", label: "Bahasa Indonesia", dictionary: { ... } })` |
| `plugin.setProfile(profileId)` | Activate an accessibility preset profile. | `plugin.setProfile("color-blind")` |
| `plugin.toggleTool(key, enable)` | Toggle individual accessibility tools. | `plugin.toggleTool("high-contrast", true)` |
| `plugin.getSettings()` | Retrieve active settings & tools state. | `console.log(plugin.getSettings())` |
| `plugin.setPosition(position)` | Move widget position on screen. | `plugin.setPosition("top-left")` |
| `plugin.setOffset(offset)` | Update launcher offset coordinates. | `plugin.setOffset("30,30")` |
| `plugin.setWidgetSize(size)` | Set widget size (`small`, `medium`, `default`). | `plugin.setWidgetSize("small")` |
| `plugin.hideFooter(hide)` | Show or hide the menu footer. | `plugin.hideFooter(true)` |
| `plugin.setFooterSize(size)` | Set footer sizing (`small`, `medium`, `large`). | `plugin.setFooterSize("small")` |
| `plugin.resetAll()` | Reset all accessibility tools to defaults. | `plugin.resetAll()` |

All methods are also exposed globally on `window.Visua11yAgentPlugin` when loaded via `<script>` tag.

## Features

For a comprehensive breakdown of all capabilities, see the [Features Guide](https://chulit.github.io/visua11y-agent/guide/features).

- **53 Global Languages**: Complete internationalization, automated `html[lang]` observation, RTL direction support, and dynamic dictionary registration.
- **True Color Blindness Simulation**: Mathematical SVG `feColorMatrix` optical filters for **Protanopia** (Red-blind), **Deuteranopia** (Green-blind), **Tritanopia** (Blue-blind), and **Achromatopsia** (Monochrome).
- **Typography & Layout Controls**: Stepped font scaling (up to 200%), line height, letter spacing, font weight, OpenDyslexic font, and link/title highlighters.
- **Contrast & Color Modes**: Light contrast, dark contrast, high contrast, inverted colors, saturation controls, monochrome, image desaturation, and custom color palette generator.
- **Reading & Assistive Utilities**: Screen reader helper (Text-to-Speech), Voice navigation commands, Reading guide focus overlay, and oversized high-visibility cursor.
- **Motion & Sensory Comfort**: Stop animations and freeze animated GIFs.
- **Root DOM Isolation**: Mounted to `document.documentElement` to remain completely immune to page CSS filters, transforms, and overflow scrolling glitches.
- **Persistent State**: Automatic syncing to `localStorage` with cookie fallback.

## Local Development

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run unit tests
npm test

# Run linter & typecheck
npm run lint
npx tsc --noEmit

# Build library bundles & docs demo
npm run build
npm run docs:publish
```

## Contributing

We welcome contributions! Whether fixing bugs, adding new language translations, improving documentation, or creating new features:

1. Fork the repository & create your feature branch: `git checkout -b feature/my-feature`
2. Ensure tests and linter pass: `npm test && npm run lint`
3. Commit changes and submit a Pull Request.

## License

Visua11y Agent is open-source software licensed under the [MIT License](LICENSE).

