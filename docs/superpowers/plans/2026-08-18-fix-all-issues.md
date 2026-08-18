# Visua11y Agent — Fix All Issues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perbaiki empat issue: (1) slim build entry point salah, (2) semua 53 locale di-load saat init padahal hanya perlu 1-2, (3) `LANGUAGE_DICTIONARY` pre-populated semua locale, (4) missing TypeScript types di `changeLanguage` dan `storage/index`.

**Architecture:** Perbaikan bersifat independent per task — tidak ada dependency antar task. Setiap task fokus satu file atau subsistem. Tidak ada refaktor besar; hanya perbaikan minimal dan terarah.

**Tech Stack:** TypeScript, esbuild, Vitest

## Global Constraints

- Run tests: `npx vitest run --pool=threads` (bukan `npx vitest run` — ada issue IPC socket di macOS)
- Build: `npm run build`
- Lint: `npm run lint`
- TS check: `npx tsc --noEmit`
- Semua 192 test harus pass setelah setiap task
- Jangan ubah public API (nama/signature fungsi di `src/index.ts`)
- Workspace root: `/Users/kholid/Documents/Project/JS/visua11y-agent`

---

## Task 1: Fix Slim Build Entry Point

**Files:**
- Modify: `esbuild.config.js:67-72`

**Masalah:** Target `slimUmd` di `esbuild.config.js` menggunakan `entryPoints: ['./src/entry.ts']` — sama dengan UMD full. Seharusnya `./src/slim.ts`.

- [ ] **Step 1: Verifikasi masalah**

```bash
node -e "
const fs = require('fs');
const umd = fs.readFileSync('dist/visua11y-agent.umd.js');
const slim = fs.readFileSync('dist/visua11y-agent.slim.umd.js');
console.log('UMD size:', (umd.length/1024).toFixed(0)+'KB');
console.log('Slim UMD size:', (slim.length/1024).toFixed(0)+'KB');
console.log('Same size?', Math.abs(umd.length - slim.length) < 5000);
"
```
Expected: `Same size? true` — menunjukkan slim UMD tidak benar-benar slim.

- [ ] **Step 2: Fix `esbuild.config.js` baris 67-72**

```js
// SEBELUM:
slimUmd: {
  format: 'iife',
  outfile: 'dist/visua11y-agent.slim.umd.js',
  entryPoints: ['./src/entry.ts'],
  globalName: 'Visua11yAgent',
},

// SESUDAH:
slimUmd: {
  format: 'iife',
  outfile: 'dist/visua11y-agent.slim.umd.js',
  entryPoints: ['./src/slim.ts'],
  globalName: 'Visua11yAgent',
},
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Verifikasi ukuran berubah**

```bash
node -e "
const fs = require('fs'), zlib = require('zlib');
const files = ['dist/visua11y-agent.umd.js','dist/visua11y-agent.slim.umd.js'];
files.forEach(f => {
  const buf = fs.readFileSync(f);
  const gz = zlib.gzipSync(buf);
  console.log(f.replace('dist/',''), (buf.length/1024).toFixed(0)+'KB raw /', (gz.length/1024).toFixed(0)+'KB gzip');
});
"
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run --pool=threads
```
Expected: `192 passed`

- [ ] **Step 6: Commit**

```bash
git add esbuild.config.js
git commit -m "fix: slim UMD build now correctly uses src/slim.ts entry point"
```

---

## Task 2: Lazy-load Locale — Hanya Load Bahasa Aktif saat Init

**Files:**
- Modify: `src/core/index.ts:70`
- Modify: `src/i18n/Languages.ts:71`

**Masalah A** (`core/index.ts` baris 70): `loadLanguages()` tanpa argumen → load semua 53 bahasa.
**Masalah B** (`Languages.ts` baris 71): `LANGUAGE_DICTIONARY = { ...ALL_LOCALES }` → semua locale di memory sejak module di-import.

### Sub-task 2a — Fix `core/index.ts`

- [ ] **Step 1: Fix `src/core/index.ts` baris 70**

```ts
// SEBELUM:
loadLanguages().then(() => {
  translateWidget();
});

// SESUDAH — pass bahasa aktif sebagai argumen:
loadLanguages(initialLanguage).then(() => {
  translateWidget();
});
```

`initialLanguage` sudah dideklarasikan di baris 53: `const initialLanguage = resolveLanguageCode(userSettings.lang || pluginConfig.lang);`

### Sub-task 2b — Fix `Languages.ts` init dictionary

- [ ] **Step 2: Fix `src/i18n/Languages.ts` baris 71**

```ts
// SEBELUM:
export const LANGUAGE_DICTIONARY: Record<string, Record<string, string>> = { ...ALL_LOCALES };

// SESUDAH — mulai kosong, locale diisi saat pertama dibutuhkan:
export const LANGUAGE_DICTIONARY: Record<string, Record<string, string>> = {};
```

> **Penting:** Jangan hapus `import { ALL_LOCALES } from './locales'` di baris 69! `ALL_LOCALES` masih digunakan di fungsi `loadLanguage()` baris 110-112 sebagai fallback lookup sebelum dynamic import.

- [ ] **Step 3: Run tests**

```bash
npx vitest run --pool=threads
```
Expected: `192 passed` — `loadLanguage()` tetap bisa menemukan locale via `ALL_LOCALES` fallback.

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/core/index.ts src/i18n/Languages.ts
git commit -m "perf: lazy-load locales — only load active language on init, not all 53"
```

---

## Task 3: TypeScript Type Annotations

**Files:**
- Modify: `src/i18n/changeLanguage.ts:9`
- Modify: `src/storage/index.ts:3,14`

**Masalah:** Parameter tanpa type annotation → implicit `any`, menghilangkan type safety.

- [ ] **Step 1: Fix `src/i18n/changeLanguage.ts` baris 9**

```ts
// SEBELUM:
export async function changeLanguage(newLang) {

// SESUDAH:
export async function changeLanguage(newLang: string): Promise<void> {
```

- [ ] **Step 2: Fix `src/storage/index.ts`**

```ts
// SEBELUM:
export function saveStorageData(key, value) {
  const jsonValue = JSON.stringify(value);
  try {
    localStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
    setCookie(key, jsonValue);
  }
}

export function getStorageData(key) {
  // ...
}

// SESUDAH:
export function saveStorageData(key: string, value: unknown): void {
  const jsonValue = JSON.stringify(value);
  try {
    localStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
    setCookie(key, jsonValue);
  }
}

export function getStorageData(key: string): Record<string, unknown> | null {
  // ... (isi fungsi tidak berubah, hanya tambah types)
}
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: 0 errors

- [ ] **Step 4: Run tests**

```bash
npx vitest run --pool=threads
```
Expected: `192 passed`

- [ ] **Step 5: Lint check**

```bash
npm run lint
```
Expected: 0 errors, 0 warnings

- [ ] **Step 6: Commit**

```bash
git add src/i18n/changeLanguage.ts src/storage/index.ts
git commit -m "fix: add TypeScript type annotations to changeLanguage and storage functions"
```

---

## Task 4: Final Validation

**Files:** Tidak ada perubahan kode.

- [ ] **Step 1: Run full suite**

```bash
npm run lint && npx tsc --noEmit && npx vitest run --pool=threads && npm run build
```
Expected: 0 lint errors, 0 TS errors, 192 tests passed, build complete.

- [ ] **Step 2: Verifikasi semua bundle sizes**

```bash
node -e "
const fs = require('fs'), zlib = require('zlib');
const files = fs.readdirSync('dist').filter(f => f.endsWith('.js') && !f.endsWith('.map'));
files.sort().forEach(f => {
  const buf = fs.readFileSync('dist/' + f);
  const gz = zlib.gzipSync(buf);
  console.log(f.padEnd(42), (buf.length/1024).toFixed(0).padStart(5)+'KB raw', (gz.length/1024).toFixed(0).padStart(5)+'KB gzip');
});
"
```

---

## Ringkasan Perubahan

| Task | File | Perubahan |
|------|------|-----------|
| 1 | `esbuild.config.js` | `slimUmd.entryPoints` → `'./src/slim.ts'` |
| 2a | `src/core/index.ts` | `loadLanguages()` → `loadLanguages(initialLanguage)` |
| 2b | `src/i18n/Languages.ts` | `LANGUAGE_DICTIONARY = { ...ALL_LOCALES }` → `= {}` |
| 3 | `src/i18n/changeLanguage.ts` | tambah `newLang: string` + return type |
| 3 | `src/storage/index.ts` | tambah types ke semua parameter dan return types |
