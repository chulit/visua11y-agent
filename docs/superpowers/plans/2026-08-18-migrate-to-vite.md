# Migrate to Vite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrasikan seluruh pipeline build, dev server, dan testing dari custom `esbuild.config.js` ke **Vite (Latest)** dengan dukungan dual distribution (Full monolithic bundle vs Slim lightweight bundle dengan dynamic locale chunks dan CDN fallback).

**Architecture:** 
- Vite Library Mode mengompilasi output ESM, CJS, dan UMD/IIFE.
- Asset HTML dan CSS di-inlining ke JS runtime menggunakan Vite plugins / query suffix (`?raw` & `?inline`).
- Mode Slim memisahkan ke-53 file locale menjadi chunk terpisah di `dist/locales/` dan mengimplementasikan hybrid loading (dynamic import untuk bundler + automatic CDN fetch fallback untuk script tag standalone).
- Vite Dev Server terintegrasi menggantikan `scripts/demo-server.js` untuk live preview demo page dengan HMR.

**Tech Stack:** Vite 6+, TypeScript 5+, Vitest 4+, Rollup

## Global Constraints

- Run tests: `npx vitest run --pool=threads`
- Test suite: Semua 192 unit tests harus tetap passing
- Public API contract: Jangan ubah ekspor publik di `src/index.ts` dan `src/slim.ts`
- Backward Compatibility: Output file di `dist/` harus tetap kompatibel dengan yang ada di `package.json` (`visua11y-agent.esm.js`, `visua11y-agent.cjs.js`, `visua11y-agent.umd.js`, `visua11y-agent.slim.*.js`)
- Workspace root: `/Users/kholid/Documents/Project/JS/visua11y-agent`

---

## Task 1: Install Vite & Configure Vite Plugins for Asset Inlining

**Files:**
- Modify: `package.json`
- Create: `vite.config.ts`

**Interfaces:**
- Menghasilkan konfigurasi Vite untuk menangani `.html` dan `.css` sebagai string JS ter-minify secara otomatis tanpa merusak import statement yang sudah ada (`import template from './menu.html'`, `import css from './menu.css'`).

- [ ] **Step 1: Install dependency Vite**

```bash
npm install -D vite@latest
```

- [ ] **Step 2: Buat `vite.config.ts` untuk Multi-target Library Build**

Buat konfigurasi Vite yang mengompilasi varian Full (`src/entry.ts` & `src/index.ts`) dan Slim (`src/slim.ts`):

```ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

export default defineConfig(({ mode }) => {
  const isSlim = mode === 'slim';
  const entry = isSlim ? resolve(__dirname, 'src/slim.ts') : resolve(__dirname, 'src/entry.ts');
  const esmEntry = isSlim ? resolve(__dirname, 'src/slim.ts') : resolve(__dirname, 'src/index.ts');

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: !isSlim, // jangan hapus folder dist saat build slim
      sourcemap: true,
      minify: 'esbuild',
      lib: {
        entry: esmEntry,
        name: 'Visua11yAgent',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          const prefix = isSlim ? 'visua11y-agent.slim' : 'visua11y-agent';
          if (format === 'es') return `${prefix}.esm.js`;
          if (format === 'cjs') return `${prefix}.cjs.js`;
          return `${prefix}.umd.js`;
        },
      },
      rollupOptions: {
        output: {
          exports: 'named',
        },
      },
    },
    // Support raw text loading for .html and .css automatically
    plugins: [
      {
        name: 'raw-html-css-loader',
        transform(code, id) {
          if (id.endsWith('.html') || id.endsWith('.css') || id.endsWith('.svg')) {
            return {
              code: `export default ${JSON.stringify(code)};`,
              map: { mappings: '' },
            };
          }
        },
      },
    ],
  };
});
```

- [ ] **Step 3: Update `package.json` build scripts**

Ubah script build di `package.json`:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build && vite build --mode slim && node scripts/copy-locales.js",
  "test": "vitest",
  ...
}
```

- [ ] **Step 4: Test build menggunakan Vite**

```bash
npm run build
```
Expected: File `dist/visua11y-agent.esm.js`, `dist/visua11y-agent.umd.js`, `dist/visua11y-agent.slim.*.js` berhasil dibuat.

- [ ] **Step 5: Run tests**

```bash
npx vitest run --pool=threads
```
Expected: `192 passed`

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.ts
git commit -m "build: setup Vite library mode and asset loaders"
```

---

## Task 2: Implement Hybrid Locale Fetching (CDN Fallback & Slim Decoupling)

**Files:**
- Create: `scripts/copy-locales.js` (menyalin file json locale ke `dist/locales/` untuk CDN/static hosting)
- Modify: `src/i18n/Languages.ts`
- Modify: `src/slim.ts`

**Interfaces:**
- `loadLanguage(code: string): Promise<Record<string, string>>`
- Mendukung dynamic loading chunk lokal + auto-fallback ke CDN `https://cdn.jsdelivr.net/npm/visua11y-agent@<version>/dist/locales/${resolvedCode}.json`.

- [ ] **Step 1: Buat `scripts/copy-locales.js`**

Memastikan file JSON bahasa tersedia di `dist/locales/` saat build:
```js
import fs from 'fs';
import path from 'path';

const srcDir = './src/locales';
const distDir = './dist/locales';

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith('.json')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
  }
});
console.log('✅ Locales copied to dist/locales/');
```

- [ ] **Step 2: Update `src/i18n/Languages.ts` dengan Hybrid Fetch Fallback**

Tambahkan fungsi CDN fetch pada `loadLanguage`:
```ts
export async function loadLanguage(code: string): Promise<Record<string, string>> {
  const resolvedCode = resolveLanguageCode(code);
  if (LANGUAGE_DICTIONARY[resolvedCode] && Object.keys(LANGUAGE_DICTIONARY[resolvedCode]).length > 0) {
    return LANGUAGE_DICTIONARY[resolvedCode];
  }

  // 1. Cek fallback in-memory jika tersedia
  if (ALL_LOCALES && ALL_LOCALES[resolvedCode]) {
    LANGUAGE_DICTIONARY[resolvedCode] = ALL_LOCALES[resolvedCode];
    return LANGUAGE_DICTIONARY[resolvedCode];
  }

  // 2. Dynamic import untuk bundler
  try {
    const dictionary = (await import(`../locales/${resolvedCode}.json`)).default;
    LANGUAGE_DICTIONARY[resolvedCode] = dictionary;
    return dictionary;
  } catch (err) {
    // 3. Fallback fetch via CDN jika dipakai via standalone script tag di browser
    if (typeof fetch !== 'undefined') {
      try {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/visua11y-agent@1.7.3/dist/locales/${resolvedCode}.json`);
        if (res.ok) {
          const data = await res.json();
          LANGUAGE_DICTIONARY[resolvedCode] = data;
          return data;
        }
      } catch (fetchErr) {
        console.warn(`[Visua11y Agent] Failed to fetch locale "${resolvedCode}" from CDN`, fetchErr);
      }
    }
  }

  LANGUAGE_DICTIONARY[resolvedCode] = LANGUAGE_DICTIONARY[resolvedCode] || {};
  return LANGUAGE_DICTIONARY[resolvedCode];
}
```

- [ ] **Step 3: Run unit tests**

```bash
npx vitest run --pool=threads
```
Expected: `192 passed`

- [ ] **Step 4: Commit**

```bash
git add scripts/copy-locales.js src/i18n/Languages.ts
git commit -m "feat(i18n): support hybrid dynamic locale loading with CDN fallback"
```

---

## Task 3: Setup Vite Dev Server for Demo Page & HMR

**Files:**
- Create/Modify: `index.html` (root dev entry untuk Vite)
- Modify: `package.json`

- [ ] **Step 1: Konfigurasi root `index.html` untuk Vite dev server**

Buat atau arahkan `index.html` di root untuk memuat demo page dengan live HMR dari `src/entry.ts`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visua11y Agent Demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/entry.ts"></script>
    <script>
      // Demo load script
      window.location.href = '/demo/';
    </script>
  </body>
</html>
```

- [ ] **Step 2: Verifikasi dev server**

Uji coba dev server:
```bash
npm run dev
```

- [ ] **Step 3: Commit**

```bash
git add index.html package.json
git commit -m "dx: add Vite dev server and HMR configuration"
```

---

## Task 4: Clean Up Obsolete Scripts & Final Verification

**Files:**
- Delete: `esbuild.config.js` (setelah Vite sepenuhnya diverifikasi)
- Modify: `package.json` (bersihkan dependency `esbuild` dan `html-minifier` jika tidak lagi digunakan)

- [ ] **Step 1: Hapus `esbuild.config.js`**

- [ ] **Step 2: Run Full Verification**

```bash
npm run lint && npx tsc --noEmit && npx vitest run --pool=threads && npm run build
```
Expected: 0 lint errors, 0 TS errors, 192 tests passed, build complete.

- [ ] **Step 3: Ukur perbandingan ukuran bundle akhir**

```bash
node -e "
const fs = require('fs'), zlib = require('zlib');
const files = fs.readdirSync('dist').filter(f => f.endsWith('.js') && !f.endsWith('.map'));
files.sort().forEach(f => {
  const buf = fs.readFileSync('dist/' + f);
  const gz = zlib.gzipSync(buf);
  console.log(f.padEnd(36), (buf.length/1024).toFixed(0).padStart(5)+'KB raw /', (gz.length/1024).toFixed(0).padStart(4)+'KB gzip');
});
"
```

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: complete migration to Vite and remove legacy build configs"
```
