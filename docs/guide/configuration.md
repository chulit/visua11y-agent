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
| `data-visua11y-agent-position` | Choose where the launcher appears.                                                                            | `data-visua11y-agent-position="bottom-right"` |
| `data-visua11y-agent-offset`   | Adjust launcher offset (`x,y`).                                                                               | `data-visua11y-agent-offset="24,24"`          |
| `data-visua11y-agent-size`     | Switch button size (`default`, `medium`, `small`).                                                            | `data-visua11y-agent-size="medium"`           |
| `data-visua11y-agent-icon`     | Provide custom HTML for the launcher icon.                                                                    | `data-visua11y-agent-icon="<span>♿️</span>"`  |

## Language Whitelist & Single Language Auto-hide

You can limit which languages are available in the accessibility widget by providing a whitelist:

```javascript
import { createVisua11yAgent } from 'visua11y-agent';

// Whitelist specific languages
createVisua11yAgent({
  languages: ['en', 'id', 'ru'], // Or string 'en, id, ru'
  lang: 'id',
});

// Single language: The language selector button in the menu header is automatically hidden
createVisua11yAgent({
  languages: ['id'],
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