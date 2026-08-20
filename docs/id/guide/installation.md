# Instalasi

Visua11y Agent dapat diinstal melalui package manager atau script tag:

## Opsi A — npm / yarn / pnpm

```bash
npm install visua11y-agent
```

### Full Bundle (Seluruh 53 bahasa ter-bundle)
```javascript
import 'visua11y-agent';
```

### Slim Bundle (Bahasa dimuat sesuai kebutuhan/on-demand)
```javascript
import 'visua11y-agent/slim';
```

### Import Programatik
```typescript
import { createVisua11yAgent } from 'visua11y-agent';

const plugin = createVisua11yAgent({
  lang: 'id',
  position: 'bottom-right'
});
```

## Best Practice yang Direkomendasikan: Integrasi Framework (SPA / MPA)

Untuk aplikasi Single Page Application (Vue, React, Next.js, Svelte, Nuxt) maupun arsitektur **Vite / Rollup Multi-Entry** (seperti Laravel + Vite, Rails, Django), sangat disarankan untuk melakukan **lazy-load** modul `visua11y-agent/slim` secara dinamis di dalam lifecycle hook komponen.

Keuntungan:
- **Non-blocking initial page load**: Skrip aksesibilitas tidak menghalangi critical rendering path halaman.
- **Isolasi Chunk CSS**: Mencegah Rollup memecah stylesheet utilitas bersama (Tailwind/UnoCSS/Bootstrap) keluar dari CSS entry point utama.
- **Ukuran bundle lebih hemat**: Kamus bahasa diunduh secara on-demand.

### Vue 2 / Vue 3
```vue
<script>
export default {
  name: 'App',
  async mounted() {
    const { createVisua11yAgent } = await import('visua11y-agent/slim');
    createVisua11yAgent({
      lang: 'id',
      languages: ['id', 'en'],
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
        lang: 'id',
        languages: ['id', 'en'],
        position: 'bottom-right',
      });
    });
  }, []);

  return null;
}
```

### Vanilla JS / MPA (Saat DOM Siap)
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  const { createVisua11yAgent } = await import('visua11y-agent/slim');
  createVisua11yAgent({
    lang: 'id',
    position: 'bottom-right',
  });
});
```

## Opsi B — CDN (Script Tag)

Gunakan distribusi CDN resmi dengan pinning versi untuk stabilitas aplikasi produksi:

```html
<!-- Full UMD Bundle (Pin versi tertentu, misal 1.8.2) -->
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent@1.8.2/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="id"
  data-visua11y-agent-position="bottom-right"
  defer
></script>
```

Atau via unpkg:
```html
<script
  src="https://unpkg.com/visua11y-agent@1.8.2/dist/visua11y-agent.umd.js"
  defer
></script>
```
