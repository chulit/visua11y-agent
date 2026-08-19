# Introduction

Welcome to the official documentation for Visua11y Agent, a lightweight accessibility widget for websites.

Visua11y Agent adds a customizable accessibility toolbar to your site so visitors can adjust contrast, typography, and interaction aids on demand. Drop it into any stack, adjust the language, and you are good to go.

## Features

-   **Multilingual UI** – 53 ready-to-use global locales with automated HTML lang detection, RTL support, and runtime custom dictionary API.
-   **Accessibility Profiles** – 8 curated WCAG/ADA preset scenarios (Motor Impaired, Blind, Color Blind, Dyslexia, Low Vision, Cognitive & Learning, Seizure & Epileptic, ADHD) with smart state memory.
-   **Color Blindness Simulation** – Real mathematical SVG `feColorMatrix` optical filters for Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.
-   **Content Adjustments** – Font size scaling (up to 200%), font weight, letter spacing, line height, OpenDyslexic typeface, and title/link highlights.
-   **Color & Contrast Controls** – Dark, Light, High Contrast, color inversion, saturation controls (low/high), monochrome mode, image desaturation, and custom color palette generator.
-   **Reading & Focus Tools** – Reading guide focus overlay, screen reader helper (Text-to-Speech), voice navigation commands, and text emphasis.
-   **Motion & Cursor Utilities** – Stop animations, freeze animated GIFs, and enlarge cursor for low-vision users.
-   **Root DOM Isolation** – Mounted directly to `document.documentElement` to guarantee fixed positioning without interference from page filters or containers.
-   **Developer Hooks & API** – Rich programmatic API on `createVisua11yAgent()` and `window.Visua11yAgentPlugin` for scripts, frameworks, and CMS integrations.

## Menu Structure

The accessibility menu is organized into the following sections:

-   **Accessibility Profiles** – Quick scenario presets with one-click activation.
-   **Content Adjustments** – Tools for modifying typography including font size, weight, spacing, line height, dyslexia font, and element highlights.
-   **Color Adjustments** – Contrast modes, color blindness simulations, color inversion, saturation, and custom palette tools.
-   **Tools** – Assistive utilities including screen reader support, voice navigation, oversized cursor, animation pausing, and reading guide.
-   **Widget Settings** – Configuration options for widget button size, screen position, offset coordinates, and language selection.