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
import { userSettings } from '../../../src/config/userSettings';
import { removeColorBlindness } from '../../../src/tools/colorBlindness';

describe('Color Blindness Accessibility Profile', () => {
  beforeEach(() => {
    localStorage.clear();
    userSettings.activeProfile = undefined;
    userSettings.states = {};
    removeColorBlindness();
    document.body.innerHTML = '';
  });

  it('should activate protanopia and helper tools when Color Blind profile is clicked', () => {
    const api = createVisua11yAgent({});
    api.openMenu();

    const colorBlindProfileBtn = document.querySelector<HTMLButtonElement>(
      '.visua11y-agent-profile-btn[data-profile="color-blind"]'
    );
    expect(colorBlindProfileBtn).not.toBeNull();

    colorBlindProfileBtn?.click();
    expect(colorBlindProfileBtn?.classList.contains('visua11y-agent-selected')).toBe(true);
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('protanopia');
  });

  it('should deactivate color blindness filter when profile is toggled off', () => {
    const api = createVisua11yAgent({});
    api.openMenu();

    const colorBlindProfileBtn = document.querySelector<HTMLButtonElement>(
      '.visua11y-agent-profile-btn[data-profile="color-blind"]'
    );

    // Activate
    colorBlindProfileBtn?.click();
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('protanopia');

    // Deactivate
    colorBlindProfileBtn?.click();
    expect(colorBlindProfileBtn?.classList.contains('visua11y-agent-selected')).toBe(false);
    expect(document.documentElement.hasAttribute('data-visua11y-color-blindness')).toBe(false);
  });
});
