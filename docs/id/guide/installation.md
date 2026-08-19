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

Atau gunakan fungsi factory modular:
```typescript
import { createVisua11yAgent } from 'visua11y-agent';

const plugin = createVisua11yAgent({
  lang: 'id',
  position: 'bottom-right'
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
