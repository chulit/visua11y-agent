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

### Programmatic Import
```typescript
import { createVisua11yAgent } from 'visua11y-agent';

const plugin = createVisua11yAgent({
  lang: 'en',
  position: 'bottom-right'
});
```

## Recommended Best Practice: Framework Integration (SPA / MPA)

For modern Single Page Applications (Vue, React, Next.js, Svelte, Nuxt) and **Vite / Rollup Multi-Entry** architectures (e.g. Laravel + Vite, Rails, Django), it is strongly recommended to **lazy-load** `visua11y-agent/slim` dynamically inside component lifecycle hooks.

Benefits:
- **Non-blocking initial page load**: Keeps accessibility scripts out of the critical rendering path.
- **CSS Chunk Isolation**: Prevents Rollup from splitting shared entry styles into secondary chunks.
- **Smaller bundle size**: Languages are fetched on-demand.

### Vue 2 / Vue 3
```vue
<script>
export default {
  name: 'App',
  async mounted() {
    const { createVisua11yAgent } = await import('visua11y-agent/slim');
    createVisua11yAgent({
      lang: 'en',
      languages: ['en', 'id', 'es'],
      position: 'bottom-right',
      buttonSize: 40,
    });
  },
};
</script>
```

### React / Next.js
```tsx
'use client';

import { useEffect } from 'react';

export function AccessibilityWidget() {
  useEffect(() => {
    import('visua11y-agent/slim').then(({ createVisua11yAgent }) => {
      createVisua11yAgent({
        lang: 'en',
        languages: ['en', 'id', 'es'],
        position: 'bottom-right',
      });
    });
  }, []);

  return null;
}
```

### Vanilla JS / MPA (DOM Ready)
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  const { createVisua11yAgent } = await import('visua11y-agent/slim');
  createVisua11yAgent({
    lang: 'en',
    position: 'bottom-right',
  });
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