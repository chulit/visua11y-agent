# Configuration Guide

Visua11y Agent offers flexible, granular configuration for both modern JavaScript frameworks (Vue, React, Next.js, Nuxt, Svelte, Angular) and CDN script-tag implementations.

---

## 🚀 Quick Start

::: code-group

```javascript [Vue 3 / React / Modern Bundlers]
import { createVisua11yAgent } from 'visua11y-agent';
// Or lightweight build: import { createVisua11yAgent } from 'visua11y-agent/slim';

const agent = createVisua11yAgent({
  lang: 'id',
  languages: ['id', 'en', 'es'],
  position: 'bottom-right',
  offset: [24, 24],
  size: 'medium',
  buttonSize: 56,
});
```

```html [HTML / CDN Script Tag]
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="id"
  data-visua11y-agent-languages="id,en,es"
  data-visua11y-agent-position="bottom-right"
  data-visua11y-agent-offset="24,24"
  defer
></script>
```

:::

---

## 📋 Comprehensive Options Reference

When initializing `visua11y-agent`, you can pass configuration options either via `createVisua11yAgent(options)` or `visua11yAgent(options)`:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`lang`** | `string` | `'en'` | Initial UI language. Supports 53 global languages. Automatically normalized (e.g. `'en-US'` &rarr; `'en'`). |
| **`languages`** | `string[]` \| `string` | `undefined` *(All 53)* | **Language Whitelist**: Array or comma-separated list of allowed languages (e.g. `['id', 'en']` or `'id,en'`). When only 1 language is specified, the language button in the menu header is automatically hidden. |
| **`position`** | `string` | `'bottom-left'` | Screen anchor position for the launcher trigger button. Supports 8 positions: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`, `'center-right'`, `'center-left'`, `'bottom-center'`, `'top-center'`. |
| **`offset`** | `number[]` \| `string` | `[20, 20]` | Margin distance `[X, Y]` (in pixels) from the screen edge. Can be an array `[24, 24]` or string `'24,24'`. |
| **`size`** | `string` \| `number` | `'default'` | Widget preset size: `'small'`, `'medium'`, `'default'` / `'large'`, or a numeric pixel width for the panel. |
| **`buttonSize`** | `number` | `58` | Explicit launcher button diameter in pixels (e.g., `48`, `56`, `64`). |
| **`icon`** | `string` | Default SVG | Custom HTML SVG markup, image URL, or template selector (e.g., `'#custom-icon-template'`). |

---

## 🎯 Detailed Option Breakdown

### 1. `position` (Launcher Button Position)

Position the floating accessibility trigger button in any of the 8 viewport locations:

```text
┌────────────────────────────────────────────────────────┐
│ [top-left]            [top-center]         [top-right] │
│                                                        │
│ [center-left]                                  [center-right]
│                                                        │
│ [bottom-left]        [bottom-center]    [bottom-right] │
└────────────────────────────────────────────────────────┘
```

```javascript
createVisua11yAgent({
  position: 'bottom-right', // Recommended default for high discoverability
});
```

### 2. `offset` (Edge Spacing)

Defines horizontal and vertical spacing from the viewport edge in pixels:

```javascript
createVisua11yAgent({
  position: 'bottom-right',
  offset: [30, 30], // 30px from right, 30px from bottom
});
```

### 3. `languages` (Language Whitelist & Auto-Hide)

Restrict the languages shown in the widget to match your website's supported locales:

```javascript
// Whitelist specific languages
createVisua11yAgent({
  languages: ['id', 'en', 'es'],
  lang: 'id', // Default active language
});

// Single-language mode:
// When exactly 1 language is specified, the language picker button
// in the modal header is automatically hidden to keep the UI clean!
createVisua11yAgent({
  languages: ['id'],
});
```

### 4. `size` & `buttonSize` (Dimensions)

Adjust the trigger button and menu drawer sizing:

```javascript
createVisua11yAgent({
  size: 'medium',    // Sizing preset ('small', 'medium', 'default')
  buttonSize: 52,    // Custom launcher diameter in pixels
});
```

### 5. `icon` (Custom Launcher Icon)

Customize the launcher button icon using inline SVG, an image URL, or an HTML template element:

::: code-group

```javascript [Inline SVG]
createVisua11yAgent({
  icon: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/>
  </svg>`
});
```

```javascript [Image URL / WebP]
createVisua11yAgent({
  icon: 'https://example.com/assets/accessibility-icon.webp'
});
```

```html [Template Element]
<!-- HTML -->
<template id="my-a11y-icon">
  <span class="custom-badge">♿</span>
</template>

<!-- JS -->
<script>
createVisua11yAgent({
  icon: '#my-a11y-icon'
});
</script>
```

:::

---

## 🌐 Custom Languages & Dictionary Overrides

Visua11y Agent includes a runtime internationalization engine that allows adding new languages, local dialects, or enterprise corporate terminology.

### Adding a New Language / Regional Dialect

```javascript
import { createVisua11yAgent } from 'visua11y-agent';

const agent = createVisua11yAgent();

// Register Javanese (jv)
agent.registerLanguage({
  code: 'jv',
  label: 'Basa Jawa (Javanese)',
  dictionary: {
    'Accessibility Menu': 'Menu Aksesibilitas',
    'Reset settings': 'Wangsulaken Sedaya Setelan',
    'Content Adjustments': 'Pangaturan Konten',
    'Color Adjustments': 'Pangaturan Werna',
    'Screen Reader': 'Pamaos Layar',
    'Voice Navigation': 'Navigasi Swara',
    'Custom Color': 'Werna Kustom',
    'Widget Position': 'Papan Widget',
    'Language': 'Basa',
    'Search languages': 'Padosi basa...',
    'Open Accessibility Menu': 'Bukak Menu Aksesibilitas',
    'Close Accessibility Menu': 'Tutup Menu Aksesibilitas',
  }
});

// Activate the newly registered language
agent.changeLanguage('jv');
```

### Overriding Existing Dictionary Keys (`merge: true`)

Use `merge: true` to override specific terms without providing an entire dictionary:

```javascript
agent.registerLanguage({
  code: 'en',
  label: 'English (Corporate)',
  merge: true,
  dictionary: {
    'Accessibility Menu': 'Enterprise Inclusion Hub',
    'Reset settings': 'Restore Default Experience',
    'Screen Reader': 'AI Voice Assistant',
  }
});
```

---

## ♿ Preset Accessibility Profiles (WCAG 2.1 / ADA)

Visua11y Agent includes 8 curated profiles that apply multiple accessibility enhancements simultaneously:

| Profile ID | Profile Name | Adjustments Applied |
| :--- | :--- | :--- |
| `motor-impaired` | **Motor Impaired** | Enlarged pointer cursor, voice navigation, disables animations, +10% font size scaling. |
| `blind` | **Blind** | High contrast mode, TTS screen reader helper, voice navigation, +15% font size scaling. |
| `color-blind` | **Color Blind** | Optical Protanopia SVG color matrix filter, OpenDyslexic font, link highlighters. |
| `dyslexia` | **Dyslexia** | OpenDyslexic typeface, expanded letter spacing, enhanced line height, weighted headings. |
| `low-vision` | **Low Vision** | 130% font scale, dark contrast theme, readable font typography, oversized cursor. |
| `cognitive-learning`| **Cognitive & Learning** | Highlights headings & links, reading guide focus overlay, voice navigation. |
| `seizure-epileptic` | **Seizure & Epileptic** | Completely freezes CSS/GIF animations, lowers saturation, desaturates media. |
| `adhd` | **ADHD** | Reading guide focus line, highlights headings/links, high legibility contrast. |

```javascript
// Programmatically activate a profile
agent.setProfile('color-blind');
```

---

## 🛠️ Programmatic API Methods

The instance returned by `createVisua11yAgent()` (or `window.Visua11yAgentPlugin`) provides full runtime control:

```typescript
interface Visua11yAgentPlugin {
  // Menu Control
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  // Language & i18n
  changeLanguage: (code: string) => void;
  registerLanguage: (options: IRegisterLanguageOptions) => string;

  // Appearance & Positioning
  setPosition: (position: string) => void;
  setOffset: (offset: number[] | string) => void;
  setWidgetSize: (size: string) => void;
  setIcon: (html?: string) => void;
  hideFooter: (hide: boolean) => void;
  setFooterSize: (size: 'small' | 'medium' | 'large') => void;

  // Tools & Profiles
  toggleTool: (key: string, enable?: boolean) => void;
  setProfile: (profileId: string) => void;
  resetAll: () => void;
  getSettings: () => ISettings;
}
```

---

## 📡 Custom DOM Events

You can listen for changes to the widget state in your application:

```javascript
// Fired when the active language changes
document.addEventListener('visua11y-agent:language:changed', (event) => {
  console.log('Language changed to:', event.detail.code);
});

// Fired when new languages are registered dynamically
document.addEventListener('visua11y-agent:languages:updated', (event) => {
  console.log('Language list updated with:', event.detail.code);
});
```

---

## 💾 State Persistence

User preferences and active accessibility tools are automatically stored in `localStorage` under the key `visua11y-agent-settings`. When a user navigates between pages or refreshes their browser, all active tools and chosen language are seamlessly restored.

To programmatically reset user preferences back to initial defaults:
```javascript
agent.resetAll();
```