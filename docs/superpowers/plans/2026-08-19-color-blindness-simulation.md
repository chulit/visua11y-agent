# True Color Blindness Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengimplementasikan simulasi buta warna optik akurat menggunakan SVG `feColorMatrix` (Protanopia, Deuteranopia, Tritanopia, Achromatopsia) dengan tombol siklus interaktif di Color Adjustments dan preset "Color Blind Profile" di Accessibility Profiles, sambil mengisolasi UI widget Visua11y agar tetap tajam dan mudah dibaca.

**Architecture:** 
- `src/tools/colorBlindness.ts`: Engine manajemen filter SVG dan injeksi CSS filter ke DOM.
- `src/components/menu/FilterButtons.ts`: Menambahkan tombol cycle `color-blindness-cycle`.
- `src/components/menu/AccessibilityProfiles.ts`: Menambahkan profil `color-blind`.
- `src/components/menu/renderButtons.ts` & `src/components/menu/renderMenu.ts`: Menangani event klik cycle button, update subtitle status aktif, dan reset state.
- `src/i18n/`: Menambahkan string terjemahan untuk tipe-tipe buta warna.

**Tech Stack:** TypeScript 5+, SVG Filters (`feColorMatrix`), Vitest.

---

## Global Constraints

- Run tests: `npm test` (`vitest run --pool=threads`)
- Pure Vanilla DOM & CSS — Zero external runtime dependencies
- UI Visua11y Agent harus dikecualikan dari efek filter (tetap memiliki kontras normal)
- Workspace root: `/Users/kholid/Documents/Project/JS/visua11y-agent`

---

## Task 1: Color Blindness SVG Engine & Unit Tests

**Files:**
- Create: `src/tools/colorBlindness.ts`
- Create: `src/icons/colorBlindnessIcon.svg`
- Test: `test/unit/tools/colorBlindness.test.ts`

- [ ] **Step 1: Buat failing unit test `test/unit/tools/colorBlindness.test.ts`**

Menguji injeksi filter SVG ke DOM, penerapan CSS class/style ke `document.documentElement` atau `body`, dan fungsi reset/cycle:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  applyColorBlindness, 
  removeColorBlindness, 
  COLOR_BLINDNESS_TYPES 
} from '../../../src/tools/colorBlindness';

describe('Color Blindness Tool', () => {
  beforeEach(() => {
    removeColorBlindness();
    document.body.innerHTML = '<div class="content">Text</div>';
  });

  it('should inject SVG filter elements into DOM', () => {
    applyColorBlindness('protanopia');
    const svgFilter = document.getElementById('visua11y-color-blindness-svg');
    expect(svgFilter).not.toBeNull();
  });

  it('should apply protanopia filter style to root/document', () => {
    applyColorBlindness('protanopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('protanopia');
  });

  it('should switch between deuteranopia, tritanopia, and achromatopsia', () => {
    applyColorBlindness('deuteranopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('deuteranopia');

    applyColorBlindness('tritanopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('tritanopia');

    applyColorBlindness('achromatopsia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('achromatopsia');
  });

  it('should clean up SVG filter and attributes when removed', () => {
    applyColorBlindness('protanopia');
    removeColorBlindness();
    expect(document.documentElement.hasAttribute('data-visua11y-color-blindness')).toBe(false);
  });
});
```

- [ ] **Step 2: Jalankan test untuk memastikan failing**

```bash
npm test test/unit/tools/colorBlindness.test.ts
```

- [ ] **Step 3: Implementasikan `src/icons/colorBlindnessIcon.svg` dan `src/tools/colorBlindness.ts`**

Buat icon mata / spectrum SVG `src/icons/colorBlindnessIcon.svg`.

Implementasikan `src/tools/colorBlindness.ts` dengan matriks ilmiah standar:
- **Protanopia** (L-cone): `0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0`
- **Deuteranopia** (M-cone): `0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0`
- **Tritanopia** (S-cone): `0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0`
- **Achromatopsia** (Monochrome luminance): `0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0`

Serta CSS isolasi untuk `.visua11y-agent-container`:
```css
html[data-visua11y-color-blindness="protanopia"] {
  filter: url('#visua11y-filter-protanopia');
}
/* Isolasi agar menu widget tidak ikut terkena filter */
.visua11y-agent-container {
  filter: none !important;
}
```

- [ ] **Step 4: Jalankan test kembali & Commit**

```bash
npm test test/unit/tools/colorBlindness.test.ts
git add src/icons/colorBlindnessIcon.svg src/tools/colorBlindness.ts test/unit/tools/colorBlindness.test.ts
git commit -m "feat(tools): implement SVG feColorMatrix color blindness simulation engine"
```

---

## Task 2: UI Button Integration & Cycle Handling in Menu

**Files:**
- Modify: `src/components/menu/FilterButtons.ts`
- Modify: `src/components/menu/renderMenu.ts`
- Modify: `src/components/menu/runAccessibility.ts`
- Modify: `src/components/menu/reset.ts`
- Test: `test/unit/components/colorBlindness-ui.test.ts`

- [ ] **Step 1: Tambahkan tombol `Color Blindness` ke `FilterButtons.ts`**

```ts
import colorBlindnessIcon from '../../icons/colorBlindnessIcon.svg';

// Di FilterButtons array:
{
  label: 'Color Blindness',
  key: 'color-blindness-cycle',
  icon: colorBlindnessIcon,
  steps: ['Protanopia', 'Deuteranopia', 'Tritanopia', 'Achromatopsia'],
}
```

- [ ] **Step 2: Hubungkan handler di `runAccessibility.ts`, `renderMenu.ts`, dan `reset.ts`**

- Di `runAccessibility.ts`: Baca `userSettings.states['color-blindness-cycle']` dan jalankan `applyColorBlindness(step)`.
- Di `renderMenu.ts`: Saat tombol `color-blindness-cycle` diklik, cycle melalui langkah-langkahnya dan perbarui label state.
- Di `reset.ts`: Bersihkan state filter dan panggil `removeColorBlindness()`.

- [ ] **Step 3: Buat unit test UI cycle & Jalankan Test**

```bash
npm test test/unit/components/colorBlindness-ui.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/components/menu/FilterButtons.ts src/components/menu/renderMenu.ts src/components/menu/runAccessibility.ts src/components/menu/reset.ts test/unit/components/colorBlindness-ui.test.ts
git commit -m "feat(ui): integrate color blindness cycle button into filter adjustments"
```

---

## Task 3: Accessibility Profile Integration & Translations

**Files:**
- Modify: `src/components/menu/AccessibilityProfiles.ts`
- Modify: `src/locales/en.json`
- Modify: `src/locales/id.json`
- Test: `test/unit/components/colorBlindness-profile.test.ts`

- [ ] **Step 1: Tambahkan "Color Blind Profile" di `AccessibilityProfiles.ts`**

```ts
{
  id: 'color-blind',
  name: 'Color Blind Profile',
  description: 'Simulates and assists users with color vision deficiencies',
  icon: colorBlindnessIcon,
  settings: {
    'color-blindness-cycle': 1, // Protanopia by default
    'readable-font': true,
    'highlight-links': true,
  },
}
```

- [ ] **Step 2: Tambahkan string terjemahan di kamus `en.json`, `id.json`**

Kata kunci:
- "Color Blindness"
- "Protanopia"
- "Deuteranopia"
- "Tritanopia"
- "Achromatopsia"
- "Color Blind Profile"
- "Simulates and assists users with color vision deficiencies"

- [ ] **Step 3: Jalankan test & Commit**

```bash
npm test
git add src/components/menu/AccessibilityProfiles.ts src/locales/
git commit -m "feat(profiles): add Color Blind Profile and locale translations"
```

---

## Task 4: Full Verification, Documentation & Production Build

- [ ] **Step 1: Update dokumentasi `docs/guide/configuration.md` dan `docs/id/guide/configuration.md`**
- [ ] **Step 2: Jalankan full checks (lint, tsc, test, build, docs:publish)**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run docs:publish
```
Expected: 0 errors, 100% tests passing, all builds successful.

- [ ] **Step 3: Commit final release**
