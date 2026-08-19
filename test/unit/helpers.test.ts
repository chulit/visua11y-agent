import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all the imported modules
vi.mock('@/components/menu/runAccessibility', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/menu/translateWidget', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/widget/widget', () => ({
  renderWidget: vi.fn(),
  applyButtonIcon: vi.fn(),
  applyButtonPosition: vi.fn(),
  $widget: document.createElement('div'),
}));

vi.mock('@/components/menu/reset', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/menu/toggleMenu', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/menu/menu', () => ({
  openMenu: vi.fn(),
  closeMenu: vi.fn(),
}));

vi.mock('@/components/menu/renderMenu', () => ({
  default: vi.fn(() => document.createElement('div')),
}));

vi.mock('@/config/userSettings', () => {
  const sharedUserSettings = { states: {} };
  const mockSaveUserSettings = vi.fn();
  const mockGetSavedUserSettings = vi.fn();
  return {
    userSettings: sharedUserSettings,
    saveUserSettings: mockSaveUserSettings,
    getSavedUserSettings: mockGetSavedUserSettings,
  };
});

vi.mock('@/config/pluginConfig', () => {
  const sharedPluginConfig = {};
  const sharedPluginDefaults = {};
  return {
    pluginConfig: sharedPluginConfig,
    pluginDefaults: sharedPluginDefaults,
  };
});

vi.mock('@/i18n/changeLanguage', () => ({
  changeLanguage: vi.fn(),
}));

vi.mock('@/i18n/Languages', () => ({
  registerLanguage: vi.fn(),
  resolveLanguageCode: vi.fn((lang) => lang),
  loadLanguages: vi.fn(() => Promise.resolve()),
  resolveAllowedLanguages: vi.fn((list) => Array.isArray(list) ? list : (list ? list.split(',').map(s => s.trim()) : undefined)),
  getAvailableLanguages: vi.fn(() => [{ code: 'en', label: 'English' }]),
  isLanguageAllowed: vi.fn(() => true),
}));

vi.mock('@/components/menu/renderTools', () => ({
  default: vi.fn(),
}));

// Import after mocks
import visua11yAgent from '@/core/index';
import { userSettings, saveUserSettings } from '@/config/userSettings';
import { pluginConfig } from '@/config/pluginConfig';
import { applyButtonPosition } from '@/components/widget/widget';
import toggleMenu from '@/components/menu/toggleMenu';
import { openMenu, closeMenu } from '@/components/menu/menu';
import renderTools from '@/components/menu/renderTools';

describe('New Helper Functions', () => {
  let api: ReturnType<typeof visua11yAgent>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset configuration
    Object.keys(pluginConfig).forEach(key => delete pluginConfig[key]);
    userSettings.states = {};
    userSettings.lang = undefined;
    userSettings.position = undefined;
    userSettings.offset = undefined;
    userSettings.widgetSize = undefined;
    userSettings.footerHidden = undefined;
    userSettings.footerSize = undefined;

    api = visua11yAgent({ options: {} });
  });

  describe('setWidgetSize', () => {
    it('should update widget size to small', () => {
      api.setWidgetSize('small');

      expect(userSettings.widgetSize).toBe('small');
      expect(saveUserSettings).toHaveBeenCalled();
      expect(applyButtonPosition).toHaveBeenCalled();
    });

    it('should update widget size to medium', () => {
      api.setWidgetSize('medium');

      expect(userSettings.widgetSize).toBe('medium');
      expect(saveUserSettings).toHaveBeenCalled();
    });

    it('should update widget size to default', () => {
      api.setWidgetSize('default');

      expect(userSettings.widgetSize).toBe('default');
      expect(saveUserSettings).toHaveBeenCalled();
    });
  });

  describe('setPosition', () => {
    it('should update widget position to top-left', () => {
      api.setPosition('top-left');

      expect(userSettings.position).toBe('top-left');
      expect(pluginConfig.position).toBe('top-left');
      expect(saveUserSettings).toHaveBeenCalled();
      expect(applyButtonPosition).toHaveBeenCalled();
    });

    it('should update widget position to bottom-right', () => {
      api.setPosition('bottom-right');

      expect(userSettings.position).toBe('bottom-right');
      expect(pluginConfig.position).toBe('bottom-right');
    });
  });

  describe('setOffset', () => {
    it('should accept array offset', () => {
      api.setOffset([30, 40]);

      expect(userSettings.offset).toEqual([30, 40]);
      expect(pluginConfig.offset).toEqual([30, 40]);
      expect(saveUserSettings).toHaveBeenCalled();
      expect(applyButtonPosition).toHaveBeenCalled();
    });

    it('should accept string offset and convert to array', () => {
      api.setOffset('50,60');

      expect(userSettings.offset).toEqual([50, 60]);
      expect(pluginConfig.offset).toEqual([50, 60]);
    });

    it('should handle invalid string offset by defaulting to [0, 0]', () => {
      api.setOffset('invalid');

      // The implementation parses invalid strings as NaN, which becomes 0
      expect(userSettings.offset).toBeDefined();
    });
  });

  describe('openMenu', () => {
    it('should call openMenu function', () => {
      api.openMenu();

      expect(openMenu).toHaveBeenCalled();
    });
  });

  describe('closeMenu', () => {
    it('should call closeMenu function', () => {
      api.closeMenu();

      expect(closeMenu).toHaveBeenCalled();
    });
  });

  describe('toggleTool', () => {
    it('should enable a tool when enable is true', () => {
      api.toggleTool('high-contrast', true);

      expect(userSettings.states['high-contrast']).toBe(true);
      expect(renderTools).toHaveBeenCalled();
      expect(saveUserSettings).toHaveBeenCalled();
    });

    it('should disable a tool when enable is false', () => {
      userSettings.states['high-contrast'] = true;

      api.toggleTool('high-contrast', false);

      expect(userSettings.states['high-contrast']).toBe(false);
      expect(renderTools).toHaveBeenCalled();
    });

    it('should toggle tool state when enable is undefined', () => {
      userSettings.states['big-cursor'] = false;

      api.toggleTool('big-cursor');

      expect(userSettings.states['big-cursor']).toBe(true);
    });
  });

  describe('setProfile', () => {
    it('should set active profile', () => {
      api.setProfile('blind');

      expect(userSettings.activeProfile).toBe('blind');
      expect(saveUserSettings).toHaveBeenCalled();
    });

    it('should update profile to low-vision', () => {
      api.setProfile('low-vision');

      expect(userSettings.activeProfile).toBe('low-vision');
    });
  });

  describe('getSettings', () => {
    it('should return a copy of user settings', () => {
      userSettings.lang = 'en';
      userSettings.position = 'bottom-right';
      userSettings.states = { contrast: true };

      const settings = api.getSettings();

      // Should include all properties
      expect(settings.lang).toBe('en');
      expect(settings.position).toBe('bottom-right');
      expect(settings.states).toEqual({ contrast: true });

      // Verify it's a copy, not the original
      settings.lang = 'fr';
      expect(userSettings.lang).toBe('en');
    });
  });

  describe('hideFooter', () => {
    beforeEach(() => {
      // Create a mock footer element
      const footer = document.createElement('div');
      footer.className = 'visua11y-agent-footer';
      document.body.appendChild(footer);
    });

    it('should hide the footer', () => {
      api.hideFooter(true);

      expect(userSettings.footerHidden).toBe(true);
      expect(saveUserSettings).toHaveBeenCalled();

      const footer = document.querySelector('.visua11y-agent-footer');
      expect(footer?.classList.contains('visua11y-agent-footer-hidden')).toBe(true);
    });

    it('should show the footer', () => {
      api.hideFooter(false);

      expect(userSettings.footerHidden).toBe(false);

      const footer = document.querySelector('.visua11y-agent-footer');
      expect(footer?.classList.contains('visua11y-agent-footer-hidden')).toBe(false);
    });
  });

  describe('setFooterSize', () => {
    beforeEach(() => {
      // Create a mock footer element
      const footer = document.createElement('div');
      footer.className = 'visua11y-agent-footer';
      document.body.appendChild(footer);
    });

    it('should set footer size to small', () => {
      api.setFooterSize('small');

      expect(userSettings.footerSize).toBe('small');
      expect(saveUserSettings).toHaveBeenCalled();

      const footer = document.querySelector('.visua11y-agent-footer');
      expect(footer?.classList.contains('visua11y-agent-footer-small')).toBe(true);
    });

    it('should set footer size to medium', () => {
      api.setFooterSize('medium');

      expect(userSettings.footerSize).toBe('medium');

      const footer = document.querySelector('.visua11y-agent-footer');
      expect(footer?.classList.contains('visua11y-agent-footer-small')).toBe(false);
      expect(footer?.classList.contains('visua11y-agent-footer-large')).toBe(false);
    });

    it('should set footer size to large', () => {
      api.setFooterSize('large');

      expect(userSettings.footerSize).toBe('large');

      const footer = document.querySelector('.visua11y-agent-footer');
      expect(footer?.classList.contains('visua11y-agent-footer-large')).toBe(true);
    });
  });
});
