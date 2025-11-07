# Visua11y Agent: Accessibility Website Widget

<p align="center">
  <img src="/src/icons/logo.png" alt="Visua11y Agent banner" width="520">
</p>

<div align="center">

[![GitHub release](https://img.shields.io/github/v/release/chulit/visua11y-agent)](https://github.com/chulit/visua11y-agent/releases)
[![GitHub issues](https://img.shields.io/github/issues/chulit/visua11y-agent)](https://github.com/chulit/visua11y-agent/issues)
[![GitHub license](https://img.shields.io/github/license/chulit/visua11y-agent)](https://github.com/chulit/visua11y-agent/blob/master/LICENSE)

Lightweight (< 30 KB) accessibility controls for any website, ready in minutes and available in 40+ languages.

</div>

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Features](#features)
- [Local Development](#local-development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Visua11y Agent adds a customizable accessibility toolbar to your site so visitors can adjust contrast, typography, and interaction aids on demand. Drop it into any stack, adjust the language, and you are good to go.

## Project Structure

The project is organized into several key directories under `src/`:

-   **`components/`**: Contains UI components such as the accessibility menu and widget.
-   **`config/`**: Holds configuration files for the plugin and user settings.
-   **`core/`**: The core logic and entry point for the Visua11y Agent.
-   **`enum/`**: Defines enumerations used throughout the project.
-   **`i18n/`**: Internationalization (i18n) related files for language handling.
-   **`icons/`**: Stores SVG icons used in the widget.
-   **`locales/`**: JSON files containing translations for various languages.
-   **`storage/`**: Handles local storage and persistence of user settings.
-   **`tools/`**: Implements the various accessibility tools (e.g., font adjustments, contrast modes).
-   **`types/`**: TypeScript type definitions.
-   **`utils/`**: Utility functions used across the project.

## Live Demo

- Explore the widget in action: [chulit.github.io/visua11y-agent](https://chulit.github.io/visua11y-agent)
- Review the demo markup inside `demo/index.html`

## Installation

### Option A — npm

```bash
npm install visua11y-agent
```

Then import the package in your bundler entry point. It bootstraps itself and attaches `window.Visua11yAgentPlugin` when the document is ready.

```js
import 'visua11y-agent';
```

### Option B — CDN

Every release is published to npm, so any npm-backed CDN can serve the compiled bundle immediately.

- **jsDelivr (UMD)** — `https://cdn.jsdelivr.net/npm/visua11y-agent@1.2.0/dist/visua11y-agent.umd.js`
- **unpkg (UMD)** — `https://unpkg.com/visua11y-agent@1.2.0/dist/visua11y-agent.umd.js`
- **esm.sh (native ESM)** — `https://esm.sh/visua11y-agent`
- **Skypack (native ESM)** — `https://cdn.skypack.dev/visua11y-agent`
- **esm.run (native ESM)** — `https://esm.run/visua11y-agent`
- **JSPM Generator (dual)** — `https://ga.jspm.io/npm:visua11y-agent/dist/visua11y-agent.esm.js`

Stick to pinned versions for stability (`@1.2.0`) and switch to `@latest` if you want automatic upgrades.

```html
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent@1.2.0/dist/visua11y-agent.umd.js"
  defer
></script>
```

## Quick Start

```html
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent@1.2.0/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="en"
  data-visua11y-agent-position="bottom-right"
  data-visua11y-agent-offset="24,24"
  defer
></script>
```

## Configuration

Control the widget through `data-visua11y-agent-*` attributes on the script tag or by calling helpers on `window.Visua11yAgentPlugin` after it loads.

### Script Attributes

| Attribute                      | Description                                        | Example                                       |
| ------------------------------ | -------------------------------------------------- | --------------------------------------------- |
| `data-visua11y-agent-lang`     | Set the default UI language.                       | `data-visua11y-agent-lang="en"`               |
| `data-visua11y-agent-position` | Choose where the launcher appears.                 | `data-visua11y-agent-position="bottom-right"` |
| `data-visua11y-agent-offset`   | Adjust launcher offset (`x,y`).                    | `data-visua11y-agent-offset="24,24"`          |
| `data-visua11y-agent-size`     | Switch button size (`default`, `medium`, `small`). | `data-visua11y-agent-size="medium"`           |
| `data-visua11y-agent-icon`     | Provide custom HTML for the launcher icon.         | `data-visua11y-agent-icon="<span>♿️</span>"`  |

### JavaScript Helpers

| Helper                                                 | Description                                       | Example                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `window.Visua11yAgentPlugin.setIcon(html)`             | Swap the floating launcher icon.                  | `Visua11yAgentPlugin.setIcon("<span>🌈</span>")`                                                                                              |
| `window.Visua11yAgentPlugin.changeLanguage(code)`      | Switch the UI language at runtime.                | `Visua11yAgentPlugin.changeLanguage("fr")`                                                                                                    |
| `window.Visua11yAgentPlugin.registerLanguage(options)` | Register new translations on the fly.             | `Visua11yAgentPlugin.registerLanguage({ code: "id", label: "Bahasa Indonesia", dictionary: { "Accessibility Menu": "Menu Aksesibilitas" } })` |
| `window.Visua11yAgentPlugin.resetAll()`                | Restore widget defaults and clear saved settings. | `Visua11yAgentPlugin.resetAll()`                                                                                                              |

See `demo/index.html` for practical examples.

## Features

- **Multilingual UI** – 40+ ready-to-use locales with runtime translation hooks and language search.
- **Content Adjustments** – Font size adjustments, font weight, letter spacing, line height, dyslexia-friendly typeface, and highlighting of titles and links.
- **Color & Contrast Controls** – Multiple contrast modes (Dark, Light, High Contrast), invert colors, saturation controls (low/high), monochrome mode, image desaturation, and a custom color palette picker for granular customization.
- **Reading & Focus Tools** – Reading guide overlay, screen reader helper, voice navigation, and text-to-speech shortcuts.
- **Motion & Cursor Utilities** – Stop animations, disable animated images, enlarge cursor for low-vision users.
- **Widget Settings** – Position controls allowing placement in 8 different locations (top-left, top-center, top-right, center-left, center-right, bottom-left, bottom-center, bottom-right).
- **Reset Functionality** – One-click reset to restore all accessibility settings to default values.
- **Developer Hooks** – Expose helpers like `plugin.setIcon`, `plugin.changeLanguage`, `plugin.registerLanguage`, and `plugin.resetAll` for deeper UI personalization.

## Menu Structure

The accessibility menu is organized into the following sections:

- **Content Adjustments** – Tools for modifying text properties including font size, weight, spacing, and special typography options.
- **Color Adjustments** – Contrast presets, color inversion options, saturation controls, and custom palette tools.
- **Tools** – Advanced accessibility tools including screen reader support, voice navigation, cursor enlargement, animation controls, and reading guides.
- **Widget Settings** – Configuration options for the widget's appearance and position on the page.

## Local Development

- Install dependencies: `npm install`
- Build the bundle: `npm run build`
- Serve the static demo: `npm run demo`
- Live reload during development: `npm run demo:serve` (esbuild watch + SSE reload)
- Open `http://127.0.0.1:4173/` to test screen reader, voice navigation, positioning, and custom locales

## Roadmap

- Accessibility profiles (save and load preset configurations)
- Widget size presets (Default, Medium, Small)

## Contributing

Improvements are welcome! Fork the repository and open a pull request with your changes. ❤️

## License

Visua11y Agent is released under the [MIT License](LICENSE).
