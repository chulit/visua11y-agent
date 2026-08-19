import { resolveWidgetSize } from './widgetSize';

const defaultSize = resolveWidgetSize('default');

export const pluginConfig = {
  lang: 'en',
  languages: undefined as string[] | undefined,
  position: 'bottom-left',
  offset: [20, 20],
  size: defaultSize.size,
  buttonSize: undefined as number | undefined,
  sizePreset: defaultSize.preset,
  panelWidth: defaultSize.panelWidth,
  icon: undefined as string | undefined,
  iconSize: undefined as number | undefined,
};

export const pluginDefaults = {
  lang: pluginConfig.lang,
  languages: pluginConfig.languages,
  position: pluginConfig.position,
  offset: [...pluginConfig.offset],
  size: pluginConfig.size,
  buttonSize: pluginConfig.buttonSize,
  sizePreset: pluginConfig.sizePreset,
  panelWidth: pluginConfig.panelWidth,
  icon: pluginConfig.icon,
  iconSize: pluginConfig.iconSize,
};
