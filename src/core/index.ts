import runAccessibility from '@/components/menu/runAccessibility';
import translateWidget from '@/components/menu/translateWidget';
import { renderWidget, applyButtonIcon, applyButtonPosition } from '@/components/widget/widget';
import reset from '@/components/menu/reset';
import { openMenu, closeMenu } from '@/components/menu/menu';
import renderTools from '@/components/menu/renderTools';

import { userSettings, getSavedUserSettings, saveUserSettings } from '@/config/userSettings';

import { pluginConfig, pluginDefaults } from '@/config/pluginConfig';
import { changeLanguage } from '@/i18n/changeLanguage';
import { 
  IRegisterLanguageOptions, 
  registerLanguage, 
  resolveLanguageCode, 
  loadLanguages,
  resolveAllowedLanguages,
  getAvailableLanguages,
  isLanguageAllowed
} from '@/i18n/Languages';
import { resolveWidgetSize } from '@/config/widgetSize';
import { ACCESSIBILITY_PROFILES } from '@/config/accessibilityProfiles';
import enableContrast from '@/tools/enableContrast';
import adjustFontSize from '@/tools/adjustFontSize';
import { FILTERS } from '@/enum/Filters';

export default function visua11yAgent(config: any = {}) {
  const savedSettings = getSavedUserSettings() || {};

  const providedOptions = config?.options ?? config ?? {};
  const { size: incomingSize, buttonSize, languages: incomingLanguages, ...restOptions } = providedOptions;

  Object.assign(pluginConfig, restOptions);
  if (typeof buttonSize === 'number') {
    pluginConfig.buttonSize = buttonSize;
  }

  if (incomingLanguages) {
    pluginConfig.languages = resolveAllowedLanguages(incomingLanguages);
  }

  const resolvedOptionSize = resolveWidgetSize(
    incomingSize ?? pluginConfig.sizePreset ?? pluginConfig.size
  );
  pluginConfig.size = resolvedOptionSize.size;
  pluginConfig.sizePreset = resolvedOptionSize.preset;
  pluginConfig.panelWidth = resolvedOptionSize.panelWidth;

  pluginDefaults.lang = pluginConfig.lang;
  pluginDefaults.languages = pluginConfig.languages;
  pluginDefaults.position = pluginConfig.position;
  pluginDefaults.offset = Array.isArray(pluginConfig.offset) ? [...pluginConfig.offset] : [20, 20];
  pluginDefaults.size = pluginConfig.size;
  pluginDefaults.buttonSize = pluginConfig.buttonSize;
  pluginDefaults.sizePreset = pluginConfig.sizePreset;
  pluginDefaults.panelWidth = pluginConfig.panelWidth;
  pluginDefaults.icon = pluginConfig.icon;
  Object.assign(userSettings, savedSettings);
  if (!userSettings.states || typeof userSettings.states !== 'object') {
    userSettings.states = {};
  }

  if (typeof userSettings.widgetSize !== 'undefined') {
    const resolvedUserSize = resolveWidgetSize(userSettings.widgetSize);
    pluginConfig.size = resolvedUserSize.size;
    pluginConfig.sizePreset = resolvedUserSize.preset;
    pluginConfig.panelWidth = resolvedUserSize.panelWidth;
  }

  const availableLanguages = getAvailableLanguages(pluginConfig.languages);
  let resolvedLang = resolveLanguageCode(userSettings.lang || pluginConfig.lang);

  if (pluginConfig.languages && !isLanguageAllowed(resolvedLang, pluginConfig.languages)) {
    resolvedLang = availableLanguages[0]?.code || 'en';
  }

  userSettings.lang = resolvedLang;
  pluginConfig.lang = resolvedLang;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = resolvedLang;
  }

  if (userSettings.position) {
    pluginConfig.position = userSettings.position;
  }

  if (Array.isArray(userSettings.offset)) {
    pluginConfig.offset = userSettings.offset;
  }

  runAccessibility();
  renderWidget();
  loadLanguages(resolvedLang).then(() => {
    translateWidget();
  });

  function setIcon(icon?: string) {
    pluginConfig.icon = icon;
    applyButtonIcon();
  }

  function registerCustomLanguage(options: IRegisterLanguageOptions) {
    const code = registerLanguage(options);
    if (code && userSettings.lang === code) {
      translateWidget();
    }
    return code;
  }

  function setWidgetSize(size: string | number) {
    const resolved = resolveWidgetSize(size);
    pluginConfig.size = resolved.size;
    pluginConfig.sizePreset = resolved.preset;
    userSettings.widgetSize = resolved.preset ?? resolved.size;
    saveUserSettings();
    applyButtonPosition();
  }

  function setButtonSize(size: number) {
    if (typeof size !== 'number' || size <= 0) {
      console.warn('[Visua11y Agent] setButtonSize expects a positive number (px).');
      return;
    }
    pluginConfig.buttonSize = size;
    applyButtonPosition();
  }

  function setPosition(position: string) {
    pluginConfig.position = position;
    userSettings.position = position;
    saveUserSettings();
    applyButtonPosition();
  }

  function setOffset(offset: string | number[]) {
    let newOffset: number[] = [20, 20];
    if (Array.isArray(offset)) {
      newOffset = offset;
    } else if (typeof offset === 'string') {
      newOffset = offset.split(',').map(Number);
    }

    pluginConfig.offset = newOffset;
    userSettings.offset = newOffset;
    saveUserSettings();
    applyButtonPosition();
  }

  function toggleTool(key: string, enable?: boolean) {
    const currentState = Boolean(userSettings.states[key]);
    const newState = typeof enable === 'boolean' ? enable : !currentState;
    userSettings.states[key] = newState;

    if (FILTERS[key] || key === 'contrast') {
      const newContrast = newState ? (key === 'contrast' ? 'high-contrast' : key) : undefined;
      userSettings.states.contrast = newContrast;
      enableContrast(newContrast);
    }

    renderTools();
    saveUserSettings();
  }

  function setProfile(profileId: string) {
    userSettings.activeProfile = profileId;
    const profile = ACCESSIBILITY_PROFILES.find((item) => item.id === profileId);
    if (profile) {
      userSettings.states = { ...(profile.states || {}) };

      if (profile.position) {
        pluginConfig.position = profile.position;
        userSettings.position = profile.position;
      }

      if (Array.isArray(profile.offset)) {
        pluginConfig.offset = [...profile.offset];
        userSettings.offset = [...profile.offset];
      }

      if (typeof profile.widgetSize !== 'undefined') {
        const resolved = resolveWidgetSize(profile.widgetSize);
        pluginConfig.size = resolved.size;
        pluginConfig.sizePreset = resolved.preset;
        userSettings.widgetSize = resolved.preset ?? resolved.size;
      }

      applyButtonPosition();
      adjustFontSize(userSettings.states.fontSize || 1);
      renderTools();
      enableContrast(userSettings.states.contrast);
    }
    saveUserSettings();
  }

  function getSettings() {
    return { ...userSettings };
  }

  function hideFooter(hide: boolean) {
    userSettings.footerHidden = hide;
    saveUserSettings();
    const footer = document.querySelector('.visua11y-agent-footer');
    if (footer) {
      if (hide) {
        footer.classList.add('visua11y-agent-footer-hidden');
      } else {
        footer.classList.remove('visua11y-agent-footer-hidden');
      }
    }
  }

  function setFooterSize(size: 'small' | 'medium' | 'large') {
    userSettings.footerSize = size;
    saveUserSettings();
    const footer = document.querySelector('.visua11y-agent-footer');
    if (footer) {
      footer.classList.remove('visua11y-agent-footer-small', 'visua11y-agent-footer-large');
      if (size === 'small') {
        footer.classList.add('visua11y-agent-footer-small');
      } else if (size === 'large') {
        footer.classList.add('visua11y-agent-footer-large');
      }
    }
  }

  return {
    changeLanguage,
    setIcon,
    setWidgetSize,
    setButtonSize,
    setPosition,
    setOffset,
    openMenu,
    closeMenu,
    toggleTool,
    setProfile,
    getSettings,
    hideFooter,
    setFooterSize,
    registerLanguage: registerCustomLanguage,
    resetAll: () => {
      reset();
    },
  };
}
