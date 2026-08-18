# Core Optimization, Accessibility & Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drastically shrink bundle size (525 KB $\rightarrow$ <50 KB) with dual-bundle distribution (slim + full) & on-demand lazy i18n, optimize logo assets, implement WCAG-compliant keyboard focus trapping / ARIA, and upgrade to a hybrid zero-reflow font rescaling engine.

**Architecture:** 
- **Dual Bundle & Lazy i18n:** Core bundle includes default locales (`en`, `id`) and lazy-fetches additional dictionaries on demand. `esbuild.config.js` outputs `visua11y-agent.slim.js` (lightweight) and `visua11y-agent.esm.js` / `.umd.js` (full/standalone).
- **Asset Optimization:** Replace heavy base64 `logo.png` with optimized `logo.webp`.
- **Keyboard Navigation & A11y:** Focus trap utility maintaining Tab cycles within the menu, `Escape` key closing modal and returning focus to launcher button, with proper ARIA markup (`role="dialog"`, `aria-modal="true"`, `aria-expanded`).
- **Hybrid Font Scaling:** Root CSS custom property `--visua11y-font-scale` combined with inline style fallback.

**Tech Stack:** TypeScript 5.9+, Vanilla DOM & CSS, Vitest with JSDOM, esbuild.

---

## Global Constraints

- Pure TypeScript / Vanilla DOM — Zero external runtime dependencies.
- Dual distribution support: `dist/visua11y-agent.slim.js` and `dist/visua11y-agent.esm.js` / `dist/visua11y-agent.umd.js`.
- All tests must pass with `npx vitest run --pool=threads`.
- Code must pass ESLint (`npm run lint`) and TypeScript check (`npx tsc --noEmit`).

---

### Task 1: Asset Optimization — Switch `logo.png` to `logo.webp`

**Files:**
- Modify: `src/components/menu/renderMenu.ts:7,154`
- Modify: `esbuild.config.js`
- Test: `test/unit/components/widget.test.ts`

**Interfaces:**
- Consumes: `src/icons/logo.webp`
- Produces: Optimized base64 / asset loader in `esbuild.config.js` with `.webp` support.

- [ ] **Step 1: Update `esbuild.config.js` to support `.webp` loader**

```javascript
// esbuild.config.js loader config
loader: { '.html': 'text', '.svg': 'text', '.png': 'dataurl', '.webp': 'dataurl' },
```

- [ ] **Step 2: Update `src/components/menu/renderMenu.ts` to import `logo.webp`**

Replace:
```typescript
import logoAsset from '@/icons/logo.png';
```
With:
```typescript
import logoAsset from '@/icons/logo.webp';
```

- [ ] **Step 3: Run build and verify bundle size reduction**

Run: `npm run build`
Expected: `dist/` bundle sizes reduce significantly.

- [ ] **Step 4: Commit**

```bash
git add esbuild.config.js src/components/menu/renderMenu.ts
git commit -m "perf(assets): replace heavy logo.png with optimized logo.webp"
```

---

### Task 2: Modal Focus Trap & Keyboard Navigation (`Escape` & `Tab` Loop)

**Files:**
- Create: `src/utils/focusTrap.ts`
- Modify: `src/components/menu/menu.ts`
- Modify: `src/components/menu/renderMenu.ts`
- Modify: `src/components/widget/widget.ts`
- Test: `test/unit/utils/focusTrap.test.ts`

**Interfaces:**
- Consumes: Modal container `HTMLElement`, launcher button `HTMLElement`.
- Produces: `setupFocusTrap(container: HTMLElement, options: { onClose: () => void, triggerButton?: HTMLElement | null })`

- [ ] **Step 1: Write unit test for `focusTrap.ts`**

```typescript
// test/unit/utils/focusTrap.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupFocusTrap } from '../../../src/utils/focusTrap';

describe('focusTrap', () => {
  let container: HTMLElement;
  let triggerBtn: HTMLButtonElement;
  let btn1: HTMLButtonElement;
  let btn2: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    triggerBtn = document.createElement('button');
    btn1 = document.createElement('button');
    btn2 = document.createElement('button');
    btn1.id = 'btn1';
    btn2.id = 'btn2';
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(triggerBtn);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should call onClose and restore focus to trigger button when Escape is pressed', () => {
    const onClose = vi.fn();
    const trap = setupFocusTrap(container, { onClose, triggerButton: triggerBtn });
    trap.enable();

    btn1.focus();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(event);

    expect(onClose).toHaveBeenCalled();
    expect(document.activeElement).toBe(triggerBtn);
    trap.disable();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/unit/utils/focusTrap.test.ts --pool=threads`
Expected: FAIL

- [ ] **Step 3: Implement `src/utils/focusTrap.ts`**

```typescript
// src/utils/focusTrap.ts
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface IFocusTrapOptions {
  onClose?: () => void;
  triggerButton?: HTMLElement | null;
}

export function setupFocusTrap(container: HTMLElement, options: IFocusTrapOptions = {}) {
  const { onClose, triggerButton } = options;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
      triggerButton?.focus();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  return {
    enable() {
      document.addEventListener('keydown', handleKeyDown);
      const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    },
    disable() {
      document.removeEventListener('keydown', handleKeyDown);
    },
  };
}
```

- [ ] **Step 4: Wire focus trap into `menu.ts` and set ARIA attributes in `menu.html` / `widget.html`**

Update `openMenu()` and `closeMenu()` in `src/components/menu/menu.ts` to enable/disable the trap and toggle `aria-expanded` on the launcher button.

- [ ] **Step 5: Run tests to verify all pass**

Run: `npx vitest run test/unit/utils/focusTrap.test.ts --pool=threads`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/utils/focusTrap.ts test/unit/utils/focusTrap.test.ts src/components/menu/menu.ts
git commit -m "feat(a11y): implement keyboard focus trap and Escape key modal close handler"
```

---

### Task 3: Hybrid Zero-Reflow Font Rescaling Engine

**Files:**
- Modify: `src/tools/adjustFontSize.ts`
- Modify: `src/components/menu/reset.ts`
- Test: `test/unit/tools/adjustFontSize.test.ts`

**Interfaces:**
- Consumes: `multiply: number` (e.g. `1.1`, `1.2`, `1.0`).
- Produces: `adjustFontSize(multiply: number): void`

- [ ] **Step 1: Update unit tests for `adjustFontSize.ts`**

```typescript
// test/unit/tools/adjustFontSize.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import adjustFontSize from '../../../src/tools/adjustFontSize';

describe('adjustFontSize', () => {
  beforeEach(() => {
    document.documentElement.style.removeProperty('--visua11y-font-scale');
    document.body.innerHTML = '<p id="test-p" style="font-size: 16px">Sample</p>';
  });

  it('should set --visua11y-font-scale custom property on documentElement', () => {
    adjustFontSize(1.2);
    expect(document.documentElement.style.getPropertyValue('--visua11y-font-scale')).toBe('1.2');
  });

  it('should adjust inline elements and reset cleanly on scale 1', () => {
    adjustFontSize(1.2);
    const p = document.getElementById('test-p') as HTMLElement;
    expect(p.style.fontSize).toContain('19.2px');

    adjustFontSize(1);
    expect(document.documentElement.style.getPropertyValue('--visua11y-font-scale')).toBe('1');
  });
});
```

- [ ] **Step 2: Implement Hybrid scaling in `src/tools/adjustFontSize.ts`**

```typescript
// src/tools/adjustFontSize.ts
import { ICON_SELECTOR } from '@/enum/Selectors';

const FONT_SIZE_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span,blockquote,div,button,.visua11y-agent-text';
const ICON_SELECTOR_SET = new Set(ICON_SELECTOR);

export default function adjustFontSize(multiply: number = 1) {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }

  // 1. Instant 60fps CSS Custom Property scaling on root
  document.documentElement.style.setProperty('--visua11y-font-scale', String(multiply));

  // 2. Fallback DOM traversal for elements with hardcoded styles
  document.querySelectorAll(FONT_SIZE_SELECTOR).forEach((el: HTMLElement) => {
    if (el.closest('.visua11y-agent-container')) {
      return;
    }
    for (const cls of Array.from(el.classList)) {
      if (ICON_SELECTOR_SET.has(cls)) {
        return;
      }
    }

    const orgFontSize =
      Number(el.dataset.visua11yAgentOrgFontSize) || parseInt(window.getComputedStyle(el).fontSize);

    if (!el.dataset.visua11yAgentOrgFontSize) {
      el.dataset.visua11yAgentOrgFontSize = String(orgFontSize);
    }

    if (multiply === 1) {
      el.style.fontSize = '';
    } else {
      const newFontSize = orgFontSize * multiply;
      el.style.fontSize = `${newFontSize}px`;
    }
  });
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npx vitest run test/unit/tools/adjustFontSize.test.ts --pool=threads`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/tools/adjustFontSize.ts test/unit/tools/adjustFontSize.test.ts
git commit -m "perf(tools): add hybrid CSS custom property and DOM fallback font scaling"
```

---

### Task 4: Lazy On-Demand i18n Engine & Dual Bundle Build Configuration

**Files:**
- Modify: `src/i18n/Languages.ts`
- Modify: `esbuild.config.js`
- Modify: `package.json`
- Test: `test/unit/i18n/i18n.test.ts`

**Interfaces:**
- Consumes: Language codes (`'en' | 'id' | ...`).
- Produces:
  - `loadLanguage(code: string): Promise<Record<string, string>>` (lazy loader).
  - Dual targets in `esbuild.config.js`: `dist/visua11y-agent.slim.js` & `dist/visua11y-agent.esm.js`.

- [ ] **Step 1: Update `src/i18n/Languages.ts` with On-Demand dynamic dictionary loading**

Update `loadLanguage(code)` to fetch and cache only the requested dictionary rather than looping all 53 on startup. Keep `en` and `id` pre-embedded as core defaults.

- [ ] **Step 2: Update `esbuild.config.js` to build `slim` and `full` bundles**

Add `slim` export target to `esbuild.config.js` and update `package.json` exports:
```json
"exports": {
  ".": {
    "types": "./types/index.d.ts",
    "import": "./dist/visua11y-agent.esm.js",
    "require": "./dist/visua11y-agent.cjs.js"
  },
  "./slim": {
    "types": "./types/index.d.ts",
    "import": "./dist/visua11y-agent.slim.esm.js"
  }
}
```

- [ ] **Step 3: Run full test suite and build verification**

Run: `npx vitest run --pool=threads && npm run build`
Expected: All 188+ tests pass, `slim` bundle created under 45 KB.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/Languages.ts esbuild.config.js package.json test/unit/i18n/i18n.test.ts
git commit -m "feat(i18n): implement on-demand lazy language loading and dual slim/full bundle targets"
```

---

### Next Roadmap Milestone (Post-Optimization)

- **Feature Milestone 2: True Color Blindness Simulation (SVG feColorMatrix)**
  - Implement `src/tools/colorBlindness.ts` for Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.
  - Wire into toolbar preset buttons and accessibility profiles.
