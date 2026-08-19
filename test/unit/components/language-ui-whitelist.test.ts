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

describe('Language Selector UI Whitelist & Single Language Auto-hide', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should show language button when multiple languages are allowed (default)', () => {
    const api = createVisua11yAgent({});
    api.openMenu();

    const $languageWrapper = document.querySelector<HTMLElement>('.visua11y-agent-language-wrapper');
    expect($languageWrapper).not.toBeNull();
    expect($languageWrapper?.style.display).not.toBe('none');
  });

  it('should show language button when multiple languages are specified', () => {
    const api = createVisua11yAgent({ languages: ['en', 'id', 'ru'] });
    api.openMenu();

    const $languageWrapper = document.querySelector<HTMLElement>('.visua11y-agent-language-wrapper');
    expect($languageWrapper).not.toBeNull();
    expect($languageWrapper?.style.display).not.toBe('none');
  });

  it('should hide language button when only 1 language is specified', () => {
    const api = createVisua11yAgent({ languages: ['id'] });
    api.openMenu();

    const $languageWrapper = document.querySelector<HTMLElement>('.visua11y-agent-language-wrapper');
    expect($languageWrapper).not.toBeNull();
    expect($languageWrapper?.style.display).toBe('none');
    expect($languageWrapper?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should only render options matching allowed languages in panel', () => {
    const api = createVisua11yAgent({ languages: ['en', 'id'] });
    api.openMenu();

    const $languageToggle = document.querySelector<HTMLButtonElement>('.visua11y-agent-menu-language');
    $languageToggle?.click();

    const options = document.querySelectorAll<HTMLButtonElement>('.visua11y-agent-language-option');
    expect(options).toHaveLength(2);
    const codes = Array.from(options).map((opt) => opt.dataset.lang);
    expect(codes).toEqual(['en', 'id']);
  });
});
