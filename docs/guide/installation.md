# Installation

Visua11y Agent can be installed via package managers or script tags:

## Option A — npm / yarn / pnpm

```bash
npm install visua11y-agent
```

### Full Bundle (All 53 languages bundled)
```javascript
import 'visua11y-agent';
```

### Slim Bundle (Languages loaded on-demand)
```javascript
import 'visua11y-agent/slim';
```

Or import the programmatic factory function:
```typescript
import { createVisua11yAgent } from 'visua11y-agent';

const plugin = createVisua11yAgent({
  lang: 'en',
  position: 'bottom-right'
});
```

## Option B — CDN (Script Tag)

Use official CDN distributions with version pinning for production stability:

```html
<!-- Full UMD Bundle (Pin specific version, e.g. 1.8.2) -->
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent@1.8.2/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="en"
  data-visua11y-agent-position="bottom-right"
  defer
></script>
```

Or via unpkg:
```html
<script
  src="https://unpkg.com/visua11y-agent@1.8.2/dist/visua11y-agent.umd.js"
  defer
></script>
```