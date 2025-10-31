# Installation

Visua11y Agent can be installed in a few ways:

## Option A — npm

```bash
npm install visua11y-agent
```

Then import the package in your bundler entry point. It bootstraps itself and attaches `window.Visua11yAgentPlugin` when the document is ready.

```js
import 'visua11y-agent';
```

## Option B — CDN

Use the prebuilt bundle in `dist/visua11y-agent.umd.js` or host it from your own CDN.

```html
<script src="https://unpkg.com/visua11y-agent" defer></script>
```