import runAccessibility from '@/components/menu/runAccessibility';
import translateWidget from '@/components/menu/translateWidget';
import { renderWidget, applyButtonIcon } from '@/components/widget/widget';
import reset from '@/components/menu/reset';

import { userSettings, getSavedUserSettings } from '@/config/userSettings';

import { pluginConfig, pluginDefaults } from '@/config/pluginConfig';
import { changeLanguage } from '@/i18n/changeLanguage';
import { IRegisterLanguageOptions, registerLanguage, resolveLanguageCode } from '@/i18n/Languages';
import { resolveWidgetSize } from '@/config/widgetSize';

export default function visua11yAgent({ options }) {
  const savedSettings = getSavedUserSettings() || {};

  const providedOptions = options || {};
  const { size: incomingSize, ...restOptions } = providedOptions;

  Object.assign(pluginConfig, restOptions);

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

  if (userSettings.position) {
    pluginConfig.position = userSettings.position;
  }

  if (Array.isArray(userSettings.offset)) {
    pluginConfig.offset = userSettings.offset;
  }

  runAccessibility();
  renderWidget();

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

  return {
    changeLanguage,
    setIcon,
    registerLanguage: registerCustomLanguage,
    resetAll: () => {
      reset();
    },
  };
}
