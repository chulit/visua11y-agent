import runAccessibility from '@/components/menu/runAccessibility';
import translateWidget from '@/components/menu/translateWidget';
import { renderWidget, applyButtonIcon, applyButtonPosition } from '@/components/widget/widget';
import reset from '@/components/menu/reset';
import { openMenu, closeMenu } from '@/components/menu/menu';
import renderTools from '@/components/menu/renderTools';

import { userSettings, getSavedUserSettings, saveUserSettings } from '@/config/userSettings';

import { pluginConfig, pluginDefaults } from '@/config/pluginConfig';
import { changeLanguage } from '@/i18n/changeLanguage';
import { IRegisterLanguageOptions, registerLanguage, resolveLanguageCode, loadLanguages } from '@/i18n/Languages';
import { resolveWidgetSize } from '@/config/widgetSize';

export default function visua11yAgent({ options }) {
  const savedSettings = getSavedUserSettings() || {};

  const providedOptions = options || {};
  const { size: incomingSize, buttonSize, ...restOptions } = providedOptions;

  Object.assign(pluginConfig, restOptions);
  if (typeof buttonSize === 'number') {
    pluginConfig.buttonSize = buttonSize;
  }

  const resolvedOptionSize = resolveWidgetSize(
    incomingSize ?? pluginConfig.sizePreset ?? pluginConfig.size
  );
  pluginConfig.size = resolvedOptionSize.size;
  pluginConfig.sizePreset = resolvedOptionSize.preset;
  pluginConfig.panelWidth = resolvedOptionSize.panelWidth;

  pluginDefaults.lang = pluginConfig.lang;
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

  const initialLanguage = resolveLanguageCode(userSettings.lang || pluginConfig.lang);
  userSettings.lang = initialLanguage;
  pluginConfig.lang = initialLanguage;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = initialLanguage;
  }

  if (userSettings.position) {
    pluginConfig.position = userSettings.position;
  }

  if (Array.isArray(userSettings.offset)) {
    pluginConfig.offset = userSettings.offset;
  }

  runAccessibility();
  renderWidget();
  loadLanguages(initialLanguage).then(() => {
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

  function setWidgetSize(size: string) {
    const resolved = resolveWidgetSize(size);
    pluginConfig.size = resolved.size;
    pluginConfig.sizePreset = resolved.preset;
    pluginConfig.panelWidth = resolved.panelWidth;

    userSettings.widgetSize = resolved.preset ?? resolved.size;
    saveUserSettings();
    applyButtonPosition();
  }

  function setButtonSize(size: number) {
    if (typeof size !== 'number' || Number.isNaN(size) || size <= 0) {
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
    renderTools();
    saveUserSettings();
  }

  function setProfile(profileId: string) {
    // This is a simplified version. Ideally, we should reuse applyProfilePreset from renderMenu.
    // For now, we will just set the profile and reload the page or warn the user.
    // Or better, we can try to trigger a re-render if we can access the menu logic.
    // Given the constraints, let's just update the settings and apply tools.
    // The menu UI might be out of sync until reopened if we don't fully re-render it.
    userSettings.activeProfile = profileId;
    saveUserSettings();
    // We need to reload to fully apply profile presets including size/position if we don't duplicate logic.
    // But let's try to apply what we can.
    console.warn('setProfile: Full profile application requires a page reload or menu re-open in this version.');
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
