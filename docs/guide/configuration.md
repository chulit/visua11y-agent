# Configuration

Control the widget through `data-visua11y-agent-*` attributes on the script tag or by calling helpers on `window.Visua11yAgentPlugin` after it loads.

## Quick Start Example

```html
<script
  src="https://unpkg.com/visua11y-agent"
  data-visua11y-agent-lang="en"
  data-visua11y-agent-position="bottom-right"
  data-visua11y-agent-offset="24,24"
  defer
></script>
```

## Script Attributes

| Attribute                      | Description                                                                                                   | Example                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `data-visua11y-agent-lang`     | Set the default UI language.                                                                                  | `data-visua11y-agent-lang="en"`               |
| `data-visua11y-agent-languages`| Restrict available languages (comma-separated). When only 1 language is specified, the language button is hidden. | `data-visua11y-agent-languages="en,id,ru"`   |
| `data-visua11y-agent-position` | Choose where the launcher appears (`bottom-right`, `bottom-left`, `top-right`, `top-left`, etc.).              | `data-visua11y-agent-position="bottom-right"` |
| `data-visua11y-agent-offset`   | Adjust launcher offset (`x,y`).                                                                               | `data-visua11y-agent-offset="24,24"`          |
| `data-visua11y-agent-size`     | Switch button size preset (`default`, `medium`, `small`).                                                     | `data-visua11y-agent-size="medium"`           |
| `data-visua11y-agent-icon`     | Provide custom HTML, image URL, or template selector for launcher icon.                                      | `data-visua11y-agent-icon="<span>♿️</span>"`  |

## JavaScript Configuration Options (NPM / Frameworks)

When importing `visua11y-agent` or `visua11y-agent/slim` in React, Vue, Next.js, or Vite, you can configure the widget using `createVisua11yAgent` or `visua11yAgent`:

```javascript
import { createVisua11yAgent } from 'visua11y-agent';
// Or if using slim: import { createVisua11yAgent } from 'visua11y-agent/slim';

const agent = createVisua11yAgent({
  lang: 'id',
  languages: ['id', 'en', 'es'],
  position: 'bottom-right',
  offset: [24, 24],
  size: 'medium',
  buttonSize: 56,
  icon: '<svg viewBox="0 0 24 24">...</svg>',
});
```

### Complete Options Reference

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`lang`** | `string` | `'en'` | Default interface language (e.g. `'id'`, `'en'`, `'es'`). |
| **`languages`** | `string[]` \| `string` | `undefined` (All 53) | **Language Whitelist**: Array or comma-separated list of allowed languages (e.g. `['id', 'en']` or `'id,en'`). |
| **`position`** | `string` | `'bottom-left'` | Launcher floating button position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`, `'center-right'`, `'center-left'`, `'bottom-center'`, `'top-center'`. |
| **`offset`** | `number[]` \| `string` | `[20, 20]` | Margin distance `[X, Y]` in pixels from the edge of the viewport. |
| **`size`** | `string` \| `number` | `'default'` | Widget/drawer size preset: `'small'`, `'medium'`, `'default'` / `'large'`. |
| **`buttonSize`** | `number` | `58` | Explicit launcher button diameter in pixels (e.g. `48`, `56`, `64`). |
| **`icon`** | `string` | SVG icon | Custom launcher button icon: SVG string, image URL, or template selector (e.g. `'#my-icon'`). |

## Language Whitelist & Single Language Auto-hide

You can limit which languages are available in the accessibility widget by providing a whitelist:

```javascript
import { createVisua11yAgent } from 'visua11y-agent';

// Whitelist specific languages
createVisua11yAgent({
  languages: ['en', 'id', 'es'],
  lang: 'id',
});

// Single language: The language selector button in the menu header is automatically hidden
createVisua11yAgent({
  languages: ['id'],
});
```

## Custom Languages & Dictionaries

Register custom languages, regional dialects, or override existing dictionary keys:

```javascript
import { createVisua11yAgent } from 'visua11y-agent';

const agent = createVisua11yAgent();

// 1. Register a new custom language/dialect
agent.registerLanguage({
  code: 'jv',
  label: 'Basa Jawa (Javanese)',
  dictionary: {
    'Accessibility Menu': 'Menu Aksesibilitas',
    'Reset settings': 'Wangsulaken Sedaya Setelan',
    'Screen Reader': 'Pamaos Layar',
  }
});

// 2. Override specific corporate terminology
agent.registerLanguage({
  code: 'en',
  label: 'English (Corporate)',
  merge: true, // Merges with existing English translations
  dictionary: {
    'Accessibility Menu': 'Enterprise Inclusion Hub',
  }
});
```

## Preset Profiles

Visua11y Agent includes 8 curated WCAG/ADA accessibility presets stored in `localStorage`:

| Profile | Description & Tool Actions |
| :--- | :--- |
| `Motor Impaired` | Big cursor, voice navigation, stop animations, +10% font size. |
| `Blind` | High contrast, screen reader helper, voice navigation, +15% font size. |
| `Color Blind` | True Protanopia optical filter matrix, dyslexia font, highlight links. |
| `Dyslexia` | OpenDyslexic typeface, extra letter spacing, increased line height, bolder weights. |
| `Low Vision` | 130% font scale, dark contrast, readable font, oversized cursor. |
| `Cognitive & Learning` | Highlight titles & links, reading guide overlay, voice navigation. |
| `Seizure & Epileptic` | Stops all CSS/GIF animations, low saturation, desaturated media. |
| `ADHD` | Reading guide focus overlay, highlight titles/links, calming contrast. |

## JavaScript Helpers

| Helper                                                 | Description                                       | Example                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `window.Visua11yAgentPlugin.setIcon(html)`             | Swap the floating launcher icon.                  | `Visua11yAgentPlugin.setIcon("<span>🌈</span>")`                                                                                              |
| `window.Visua11yAgentPlugin.changeLanguage(code)`      | Switch the UI language at runtime.                | `Visua11yAgentPlugin.changeLanguage("fr")`                                                                                                    |
| `window.Visua11yAgentPlugin.registerLanguage(options)` | Register new translations on the fly.             | `Visua11yAgentPlugin.registerLanguage({ code: "id", label: "Bahasa Indonesia", dictionary: { "Accessibility Menu": "Menu Aksesibilitas" } })` |
| `window.Visua11yAgentPlugin.setWidgetSize(size)`     | Change the widget button size.                    | `Visua11yAgentPlugin.setWidgetSize("small")`                                                                                                  |
| `window.Visua11yAgentPlugin.setPosition(position)`     | Move the widget to a new position.                | `Visua11yAgentPlugin.setPosition("top-left")`                                                                                                 |
| `window.Visua11yAgentPlugin.setOffset(offset)`         | Adjust the widget offset.                         | `Visua11yAgentPlugin.setOffset("50,50")`                                                                                                      |
| `window.Visua11yAgentPlugin.openMenu()`                | Open the accessibility menu.                      | `Visua11yAgentPlugin.openMenu()`                                                                                                              |
| `window.Visua11yAgentPlugin.closeMenu()`               | Close the accessibility menu.                     | `Visua11yAgentPlugin.closeMenu()`                                                                                                             |
| `window.Visua11yAgentPlugin.toggleTool(key, enable)`   | Toggle a specific tool on or off.                 | `Visua11yAgentPlugin.toggleTool("high-contrast", true)`                                                                                       |
| `window.Visua11yAgentPlugin.setProfile(profileId)`     | Set the active accessibility profile.             | `Visua11yAgentPlugin.setProfile("blind")`                                                                                                     |
| `window.Visua11yAgentPlugin.getSettings()`             | Get the current user settings object.             | `console.log(Visua11yAgentPlugin.getSettings())`                                                                                              |
| `window.Visua11yAgentPlugin.hideFooter(hide)`          | Hide or show the menu footer.                     | `Visua11yAgentPlugin.hideFooter(true)`                                                                                                        |
| `window.Visua11yAgentPlugin.setFooterSize(size)`       | Set the menu footer size.                         | `Visua11yAgentPlugin.setFooterSize("small")`                                                                                                  |
| `window.Visua11yAgentPlugin.resetAll()`                | Restore widget defaults and clear saved settings. | `Visua11yAgentPlugin.resetAll()`                                                                                                              |

See `demo/index.html` for practical examples.