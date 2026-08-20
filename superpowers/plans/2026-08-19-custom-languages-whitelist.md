# Custom Languages Whitelist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan fitur whitelist bahasa kustom (`languages?: string[] | string` / `data-visua11y-agent-languages="en,id,ru"`). Jika hanya ada 1 bahasa yang diizinkan, tombol pemilih bahasa di header menu disembunyikan. Jika ada beberapa bahasa, modal pencarian bahasa hanya menampilkan bahasa yang di-whitelist.

**Architecture:** 
- `pluginConfig.languages`: Menyimpan daftar kode bahasa yang diizinkan (atau `undefined` jika semua bahasa diizinkan).
- `getAvailableLanguages()` di `src/i18n/Languages.ts`: Mengembalikan list `ILanguage` yang sudah difilter berdasarkan whitelist.
- `src/components/menu/renderMenu.ts`: Menyembunyikan icon pemilih bahasa jika `getAvailableLanguages().length <= 1`.
- `src/core/index.ts`: Menjamin `initialLanguage` selalu valid dan masuk dalam whitelist bahasa.
- `src/entry.ts`: Mendukung attribute `data-visua11y-agent-languages`.

**Tech Stack:** TypeScript 5+, Vite, Vitest

## Global Constraints

- Run tests: `npm test` (yaitu `vitest run --pool=threads`)
- Semua 192 unit tests yang sudah ada harus tetap lulus + test baru untuk whitelist bahasa
- Backward Compatibility: Jika opsi `languages` tidak disediakan, seluruh 53 bahasa tetap aktif secara default
- Workspace root: `/Users/kholid/Documents/Project/JS/visua11y-agent`

---

## Task 1: Type Definitions & Language Whitelist Helper

**Files:**
- Modify: `src/index.ts` (update `Visua11yAgentOptions`)
- Modify: `src/config/pluginConfig.ts` (tambah field `languages`)
- Modify: `src/i18n/Languages.ts` (tambah `resolveAllowedLanguages`, `getAvailableLanguages`, `isLanguageAllowed`)
- Test: `test/unit/i18n/languages-whitelist.test.ts`

- [ ] **Step 1: Tulis failing unit test untuk helper whitelist bahasa**

Buat `test/unit/i18n/languages-whitelist.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { 
  resolveAllowedLanguages, 
  getAvailableLanguages, 
  isLanguageAllowed 
} from '../../../src/i18n/Languages';

describe('Language Whitelist Helpers', () => {
  it('should parse array of language codes correctly', () => {
    const list = resolveAllowedLanguages(['en', 'id', 'RU']);
    expect(list).toEqual(['en', 'id', 'ru']);
  });

  it('should parse comma-separated string correctly', () => {
    const list = resolveAllowedLanguages('en, id, ru, fr');
    expect(list).toEqual(['en', 'id', 'ru', 'fr']);
  });

  it('should return undefined when no whitelist is passed', () => {
    expect(resolveAllowedLanguages(undefined)).toBeUndefined();
    expect(resolveAllowedLanguages([])).toBeUndefined();
  });

  it('should filter available languages based on whitelist', () => {
    const available = getAvailableLanguages(['en', 'id']);
    expect(available).toHaveLength(2);
    expect(available.map(l => l.code)).toEqual(['en', 'id']);
  });

  it('should return all languages if whitelist is empty or undefined', () => {
    const available = getAvailableLanguages(undefined);
    expect(available.length).toBeGreaterThan(50);
  });

  it('should check if language is allowed', () => {
    expect(isLanguageAllowed('id', ['en', 'id'])).toBe(true);
    expect(isLanguageAllowed('fr', ['en', 'id'])).toBe(false);
    expect(isLanguageAllowed('fr', undefined)).toBe(true);
  });
});
```

- [ ] **Step 2: Jalankan test untuk memastikan failing**

```bash
npm test test/unit/i18n/languages-whitelist.test.ts
```
Expected: FAIL (fungsi belum diekspor/dibuat).

- [ ] **Step 3: Implementasi helper di `src/i18n/Languages.ts`, `src/index.ts`, dan `src/config/pluginConfig.ts`**

Update `src/index.ts`:
```ts
export interface Visua11yAgentOptions {
  lang?: string;
  languages?: string[] | string;
  position?: string;
  offset?: number[] | string;
  size?: string;
  icon?: string;
}
```

Update `src/config/pluginConfig.ts`:
```ts
export const pluginConfig = {
  lang: 'en',
  languages: undefined as string[] | undefined,
  position: 'bottom-left',
  ...
};
```

Update `src/i18n/Languages.ts`:
```ts
export function resolveAllowedLanguages(input?: string[] | string | null): string[] | undefined {
  if (!input) return undefined;
  const rawList = Array.isArray(input) ? input : String(input).split(',');
  const normalized = rawList
    .map((code) => normalizeCode(code).toLowerCase())
    .filter((code) => Boolean(code) && Boolean(findLanguage(code)));

  return normalized.length > 0 ? normalized : undefined;
}

export function getAvailableLanguages(allowedCodes?: string[]): ILanguage[] {
  if (!allowedCodes || allowedCodes.length === 0) {
    return LANGUAGES;
  }
  const allowedSet = new Set(allowedCodes.map((c) => c.toLowerCase()));
  return LANGUAGES.filter((lang) => allowedSet.has(lang.code.toLowerCase()));
}

export function isLanguageAllowed(code: string, allowedCodes?: string[]): boolean {
  if (!allowedCodes || allowedCodes.length === 0) {
    return true;
  }
  const resolved = resolveLanguageCode(code).toLowerCase();
  return allowedCodes.some((c) => c.toLowerCase() === resolved);
}
```

- [ ] **Step 4: Run test kembali**

```bash
npm test test/unit/i18n/languages-whitelist.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts src/config/pluginConfig.ts src/i18n/Languages.ts test/unit/i18n/languages-whitelist.test.ts
git commit -m "feat(i18n): add language whitelist resolvers and helpers"
```

---

## Task 2: Core Initialization & Fallback Handling

**Files:**
- Modify: `src/core/index.ts`
- Modify: `src/entry.ts`
- Test: `test/unit/core/languages-options.test.ts`

- [ ] **Step 1: Tulis test untuk inisialisasi core dengan `languages` option**

Buat `test/unit/core/languages-options.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import visua11yAgent from '../../../src/core';
import { pluginConfig } from '../../../src/config/pluginConfig';
import { userSettings } from '../../../src/config/userSettings';

describe('Core Languages Option Handling', () => {
  beforeEach(() => {
    userSettings.lang = undefined;
    pluginConfig.languages = undefined;
  });

  it('should initialize with provided languages array', () => {
    visua11yAgent({ options: { languages: ['id', 'ru'], lang: 'id' } });
    expect(pluginConfig.languages).toEqual(['id', 'ru']);
    expect(userSettings.lang).toBe('id');
  });

  it('should fallback to first allowed language if requested lang is not in whitelist', () => {
    visua11yAgent({ options: { languages: ['id', 'ru'], lang: 'fr' } });
    expect(userSettings.lang).toBe('id');
  });

  it('should accept comma-separated string for languages', () => {
    visua11yAgent({ options: { languages: 'en, id, ja' } });
    expect(pluginConfig.languages).toEqual(['en', 'id', 'ja']);
  });
});
```

- [ ] **Step 2: Update `src/core/index.ts` dan `src/entry.ts`**

Di `src/core/index.ts`:
```ts
  if (providedOptions.languages) {
    pluginConfig.languages = resolveAllowedLanguages(providedOptions.languages);
  }

  const availableLanguages = getAvailableLanguages(pluginConfig.languages);
  let resolvedLang = resolveLanguageCode(userSettings.lang || pluginConfig.lang);

  // Jika bahasa yang diminta tidak ada di whitelist, fallback ke bahasa pertama yang diizinkan
  if (pluginConfig.languages && !isLanguageAllowed(resolvedLang, pluginConfig.languages)) {
    resolvedLang = availableLanguages[0]?.code || 'en';
  }

  userSettings.lang = resolvedLang;
  pluginConfig.lang = resolvedLang;
```

Di `src/entry.ts`:
```ts
    const options = {
      lang: getDefaultLanguage(),
      languages: getScriptDataAttribute('languages'),
      position: getScriptDataAttribute('position'),
      offset: getScriptDataAttribute('offset')?.split(',').map(Number),
      size: getScriptDataAttribute('size'),
      icon: getScriptDataAttribute('icon'),
    };
```

- [ ] **Step 3: Run test**

```bash
npm test test/unit/core/languages-options.test.ts
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/core/index.ts src/entry.ts test/unit/core/languages-options.test.ts
git commit -m "feat(core): sanitize initial language against allowed languages whitelist"
```

---

## Task 3: UI Integration (Hide Button on Single Language & Filter Panel List)

**Files:**
- Modify: `src/components/menu/renderMenu.ts`
- Test: `test/unit/components/language-ui-whitelist.test.ts`

- [ ] **Step 1: Update `renderMenu.ts` untuk menampilkan/menyembunyikan tombol bahasa dan memfilter dropdown**

1. Pada render menu (`renderMenu.ts`):
```ts
  const availableLanguages = getAvailableLanguages(pluginConfig.languages);

  // Sembunyikan wrapper tombol bahasa jika hanya ada <= 1 bahasa
  if ($languageWrapper) {
    if (availableLanguages.length <= 1) {
      $languageWrapper.style.display = 'none';
      $languageWrapper.setAttribute('aria-hidden', 'true');
    } else {
      $languageWrapper.style.display = '';
      $languageWrapper.removeAttribute('aria-hidden');
    }
  }
```

2. Pada fungsi `renderLanguageList`:
Ganti `LANGUAGES.filter(...)` menjadi:
```ts
  const availableLanguages = getAvailableLanguages(pluginConfig.languages);
  const items = availableLanguages.filter((language) => {
    ...
  });
```

- [ ] **Step 2: Jalankan full test suite**

```bash
npm test
```
Expected: Semua unit test (termasuk 192 test awal + test baru) PASS.

- [ ] **Step 3: Build library & Verifikasi Demo**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/menu/renderMenu.ts
git commit -m "feat(ui): hide language toggle when <= 1 language and filter language picker list"
```

---

## Task 4: Final Validation & Build

- [ ] **Step 1: Jalankan linter & typecheck**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```
Expected: 0 lint errors, 0 TS errors, 100% tests passing, build sukses.

- [ ] **Step 2: Commit final status**
