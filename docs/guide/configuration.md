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

| Attribute                      | Description                                        | Example                                       |
| ------------------------------ | -------------------------------------------------- | --------------------------------------------- |
| `data-visua11y-agent-lang`     | Set the default UI language.                       | `data-visua11y-agent-lang="en"`               |
| `data-visua11y-agent-position` | Choose where the launcher appears.                 | `data-visua11y-agent-position="bottom-right"` |
| `data-visua11y-agent-offset`   | Adjust launcher offset (`x,y`).                    | `data-visua11y-agent-offset="24,24"`          |
| `data-visua11y-agent-size`     | Switch button size (`default`, `medium`, `small`). | `data-visua11y-agent-size="medium"`           |
| `data-visua11y-agent-icon`     | Provide custom HTML for the launcher icon.         | `data-visua11y-agent-icon="<span>♿️</span>"`  |

## JavaScript Helpers

| Helper                                                 | Description                                       | Example                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `window.Visua11yAgentPlugin.setIcon(html)`             | Swap the floating launcher icon.                  | `Visua11yAgentPlugin.setIcon("<span>🌈</span>")`                                                                                              |
| `window.Visua11yAgentPlugin.changeLanguage(code)`      | Switch the UI language at runtime.                | `Visua11yAgentPlugin.changeLanguage("fr")`                                                                                                    |
| `window.Visua11yAgentPlugin.registerLanguage(options)` | Register new translations on the fly.             | `Visua11yAgentPlugin.registerLanguage({ code: "id", label: "Bahasa Indonesia", dictionary: { "Accessibility Menu": "Menu Aksesibilitas" } })` |
| `window.Visua11yAgentPlugin.resetAll()`                | Restore widget defaults and clear saved settings. | `Visua11yAgentPlugin.resetAll()`                                                                                                              |

See `demo/index.html` for practical examples.