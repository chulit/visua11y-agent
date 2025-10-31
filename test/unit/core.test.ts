import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock all the imported modules - using @/ aliases to match what the core module uses internally
vi.mock('@/components/menu/runAccessibility', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/menu/translateWidget', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/widget/widget', () => ({
  renderWidget: vi.fn(),
  applyButtonIcon: vi.fn(),
}));

vi.mock('@/components/menu/reset', () => ({
  default: vi.fn(),
}));

vi.mock('@/config/userSettings', () => {
  const sharedUserSettings = { states: {} };
  const mockGetSavedUserSettings = vi.fn();
  return {
    userSettings: sharedUserSettings,
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
  resolveLanguageCode: vi.fn((lang) => lang), // Return the input language by default
}));

// We can now import and use the shared objects
import visua11yAgent from '@/core/index';
import runAccessibility from '@/components/menu/runAccessibility';
import translateWidget from '@/components/menu/translateWidget';
import { renderWidget, applyButtonIcon } from '@/components/widget/widget';
import reset from '@/components/menu/reset';
import { userSettings, getSavedUserSettings } from '@/config/userSettings';
import { pluginConfig, pluginDefaults } from '@/config/pluginConfig';
import { changeLanguage } from '@/i18n/changeLanguage';
import { registerLanguage, resolveLanguageCode } from '@/i18n/Languages';

describe('visua11yAgent', () => {
  beforeEach(() => {
    // Reset all mocks and configuration objects
    vi.clearAllMocks();
    
    // Reset pluginConfig and pluginDefaults to empty objects
    Object.keys(pluginConfig).forEach(key => delete pluginConfig[key]);
    Object.keys(pluginDefaults).forEach(key => delete pluginDefaults[key]);
    
    // Reset userSettings
    userSettings.states = {};
    userSettings.lang = undefined;
    
    // Mock default return values
    (getSavedUserSettings as vi.Mock).mockReturnValue({});
    (resolveLanguageCode as vi.Mock).mockReturnValue('en');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with provided options', () => {
    const options = {
      lang: 'fr',
      position: 'top-left',
      offset: [10, 10],
      size: 'medium',
      icon: '<svg>test</svg>',
    };
    
    (resolveLanguageCode as vi.Mock).mockReturnValue('fr'); // Make sure resolveLanguageCode returns the expected value
    
    visua11yAgent({ options });
    
    expect(pluginConfig.lang).toBe('fr');
    expect(pluginConfig.position).toBe('top-left');
    expect(pluginConfig.offset).toEqual([10, 10]);
    expect(pluginConfig.size).toBe('medium');
    expect(pluginConfig.icon).toBe('<svg>test</svg>');
  });

  it('should set plugin defaults based on options', () => {
    const options = {
      lang: 'es',
      position: 'bottom-right',
      offset: [30, 30],
      size: 'small',
      icon: '<span>icon</span>',
    };
    
    (resolveLanguageCode as vi.Mock).mockReturnValue('es'); // Make sure resolveLanguageCode returns the expected value
    
    visua11yAgent({ options });
    
    expect(pluginDefaults.lang).toBe('es');
    expect(pluginDefaults.position).toBe('bottom-right');
    expect(pluginDefaults.offset).toEqual([30, 30]);
    expect(pluginDefaults.size).toBe('small');
    expect(pluginDefaults.icon).toBe('<span>icon</span>');
  });

  it('should handle non-array offset by defaulting to [20, 20]', () => {
    const options = {
      offset: 'invalid',
    };
    
    visua11yAgent({ options });
    
    expect(pluginDefaults.offset).toEqual([20, 20]);
  });

  it('should apply saved user settings if available', () => {
    const savedSettings = {
      lang: 'de',
      position: 'center-left',
      states: { contrast: true, fontSize: 1.2 },
    };
    
    (getSavedUserSettings as vi.Mock).mockReturnValue(savedSettings);
    (resolveLanguageCode as vi.Mock).mockReturnValue('de'); // Make sure resolveLanguageCode returns the expected value
    
    visua11yAgent({ options: {} });
    
    expect(userSettings.lang).toBe('de');
    expect(userSettings.position).toBe('center-left');
    expect(userSettings.states).toEqual({ contrast: true, fontSize: 1.2 });
  });

  it('should initialize userSettings.states as an empty object if not present', () => {
    (getSavedUserSettings as vi.Mock).mockReturnValue({});
    
    visua11yAgent({ options: {} });
    
    expect(userSettings.states).toEqual({});
  });

  it('should resolve language code and update both userSettings and pluginConfig', () => {
    (resolveLanguageCode as vi.Mock).mockReturnValue('fr');
    
    visua11yAgent({ options: { lang: 'en' } });
    
    expect(resolveLanguageCode).toHaveBeenCalledWith('en');
    expect(userSettings.lang).toBe('fr');
    expect(pluginConfig.lang).toBe('fr');
  });

  it('should use userSettings lang if available for resolving language code', () => {
    (getSavedUserSettings as vi.Mock).mockReturnValue({ lang: 'es' });
    (resolveLanguageCode as vi.Mock).mockReturnValue('es');
    
    visua11yAgent({ options: { lang: 'en' } });
    
    expect(resolveLanguageCode).toHaveBeenCalledWith('es');
    expect(userSettings.lang).toBe('es');
    expect(pluginConfig.lang).toBe('es');
  });

  it('should update pluginConfig position from userSettings if available', () => {
    (getSavedUserSettings as vi.Mock).mockReturnValue({ position: 'top-center' });
    
    visua11yAgent({ options: { position: 'bottom-right' } });
    
    expect(pluginConfig.position).toBe('top-center');
  });

  it('should update pluginConfig offset from userSettings if available', () => {
    const userOffset = [50, 10];
    (getSavedUserSettings as vi.Mock).mockReturnValue({ offset: userOffset });
    
    visua11yAgent({ options: { offset: [20, 20] } });
    
    expect(pluginConfig.offset).toEqual(userOffset);
  });

  it('should call runAccessibility and renderWidget during initialization', () => {
    visua11yAgent({ options: {} });
    
    expect(runAccessibility).toHaveBeenCalled();
    expect(renderWidget).toHaveBeenCalled();
  });

  describe('returned API functions', () => {
    it('should return an object with expected API methods', () => {
      const api = visua11yAgent({ options: {} });
      
      expect(api).toHaveProperty('changeLanguage');
      expect(api).toHaveProperty('setIcon');
      expect(api).toHaveProperty('registerLanguage');
      expect(api).toHaveProperty('resetAll');
    });

    describe('setIcon', () => {
      it('should update pluginConfig.icon and call applyButtonIcon', () => {
        const api = visua11yAgent({ options: {} });
        
        api.setIcon('<span>new icon</span>');
        
        expect(pluginConfig.icon).toBe('<span>new icon</span>');
        expect(applyButtonIcon).toHaveBeenCalled();
      });

      it('should set pluginConfig.icon to undefined when called without parameter', () => {
        const api = visua11yAgent({ options: {} });
        
        api.setIcon();
        
        expect(pluginConfig.icon).toBeUndefined();
        expect(applyButtonIcon).toHaveBeenCalled();
      });
    });

    describe('registerLanguage', () => {
      it('should call registerLanguage with provided options', () => {
        const mockRegisterOptions = {
          code: 'test',
          label: 'Test Language',
          dictionary: { 'Hello': 'Test Hello' },
        };
        
        (registerLanguage as vi.Mock).mockReturnValue('test');
        
        const api = visua11yAgent({ options: {} });
        const result = api.registerLanguage(mockRegisterOptions);
        
        expect(registerLanguage).toHaveBeenCalledWith(mockRegisterOptions);
        expect(result).toBe('test');
      });

      it('should call translateWidget if the registered language matches current user language', () => {
        const mockRegisterOptions = {
          code: 'test',
          label: 'Test Language',
          dictionary: { 'Hello': 'Test Hello' },
        };
        
        (registerLanguage as vi.Mock).mockReturnValue('test');
        
        const api = visua11yAgent({ options: {} });
        userSettings.lang = 'test';
        api.registerLanguage(mockRegisterOptions);
        
        expect(translateWidget).toHaveBeenCalled();
      });

      it('should not call translateWidget if the registered language does not match current user language', () => {
        const mockRegisterOptions = {
          code: 'test',
          label: 'Test Language',
          dictionary: { 'Hello': 'Test Hello' },
        };
        
        (registerLanguage as vi.Mock).mockReturnValue('test');
        userSettings.lang = 'other';
        
        const api = visua11yAgent({ options: {} });
        api.registerLanguage(mockRegisterOptions);
        
        expect(translateWidget).not.toHaveBeenCalled();
      });
    });

    describe('resetAll', () => {
      it('should call reset function', () => {
        const api = visua11yAgent({ options: {} });
        api.resetAll();
        
        expect(reset).toHaveBeenCalled();
      });
    });
  });
});