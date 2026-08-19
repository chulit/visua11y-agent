import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('../../../src/components/menu/menu.html', () => ({
  default: fs.readFileSync(path.resolve(__dirname, '../../../src/components/menu/menu.html'), 'utf8'),
}));

vi.mock('../../../src/components/menu/menu.css', () => ({
  default: '/* mock css */',
}));

import { VERSION, version } from '../../../src/version';
import packageJson from '../../../package.json';
import { createVisua11yAgent } from '../../../src/index';

describe('Footer Version Display', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.querySelectorAll('.visua11y-agent-container, .visua11y-agent-menu, .visua11y-agent-widget').forEach((el) => el.remove());
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.querySelectorAll('.visua11y-agent-container, .visua11y-agent-menu, .visua11y-agent-widget').forEach((el) => el.remove());
  });

  it('should export correct VERSION matching package.json', () => {
    expect(VERSION).toBe(packageJson.version);
    expect(version).toBe(packageJson.version);
  });

  it('should render version in menu footer', () => {
    const api = createVisua11yAgent({});
    api.openMenu();

    const $versionEl = document.querySelector<HTMLElement>('[data-visua11y-agent-version]');
    expect($versionEl).not.toBeNull();
    expect($versionEl?.textContent).toBe(`v${packageJson.version}`);
  });
});
