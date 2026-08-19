import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('../../../src/components/menu/menu.html', () => ({
  default: fs.readFileSync(path.resolve(__dirname, '../../../src/components/menu/menu.html'), 'utf8'),
}));

vi.mock('../../../src/components/menu/menu.css', () => ({
  default: '/* mock css */',
}));

import { createVisua11yAgent } from '../../../src/index';
import reset from '../../../src/components/menu/reset';

describe('Color Blindness UI Button & Cycle', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.querySelectorAll('.visua11y-agent-container, .visua11y-agent-menu').forEach((el) => el.remove());
  });

  it('should render color blindness cycle button in menu', () => {
    const api = createVisua11yAgent({});
    api.openMenu();

    const btn = document.querySelector<HTMLButtonElement>(
      '.visua11y-agent-filter[data-key="color-blindness-cycle"]'
    );
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute('aria-pressed')).toBe('false');
  });

  it('should cycle through all 4 color blindness types on click and then reset', () => {
    const api = createVisua11yAgent({});
    api.openMenu();

    const btn = document.querySelector<HTMLButtonElement>(
      '.visua11y-agent-filter[data-key="color-blindness-cycle"]'
    );
    const label = btn?.querySelector<HTMLSpanElement>('.visua11y-agent-translate');

    // 1. First click: Protanopia
    btn?.click();
    expect(btn?.getAttribute('aria-pressed')).toBe('true');
    expect(label?.textContent).toBe('Protanopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('protanopia');

    // 2. Second click: Deuteranopia
    btn?.click();
    expect(label?.textContent).toBe('Deuteranopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('deuteranopia');

    // 3. Third click: Tritanopia
    btn?.click();
    expect(label?.textContent).toBe('Tritanopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('tritanopia');

    // 4. Fourth click: Achromatopsia
    btn?.click();
    expect(label?.textContent).toBe('Achromatopsia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('achromatopsia');

    // 5. Fifth click: Off
    btn?.click();
    expect(btn?.getAttribute('aria-pressed')).toBe('false');
    expect(label?.textContent).toBe('Color Blindness');
    expect(document.documentElement.hasAttribute('data-visua11y-color-blindness')).toBe(false);
  });

  it('should reset color blindness state when reset is called', () => {
    const api = createVisua11yAgent({});
    api.openMenu();

    const btn = document.querySelector<HTMLButtonElement>(
      '.visua11y-agent-filter[data-key="color-blindness-cycle"]'
    );
    btn?.click(); // Activate Protanopia
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('protanopia');

    reset();
    expect(document.documentElement.hasAttribute('data-visua11y-color-blindness')).toBe(false);
    expect(btn?.getAttribute('aria-pressed')).toBe('false');
  });
});
