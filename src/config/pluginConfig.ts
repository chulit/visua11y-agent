import { resolveWidgetSize } from './widgetSize';

const defaultSize = resolveWidgetSize('default');

export const pluginConfig = {
  lang: 'en',
  position: 'bottom-left',
  offset: [20, 20],
  size: defaultSize.size,
  sizePreset: defaultSize.preset,
  panelWidth: defaultSize.panelWidth,
  icon: undefined as string | undefined,
};

export const pluginDefaults = {
  lang: pluginConfig.lang,
  position: pluginConfig.position,
  offset: [...pluginConfig.offset],
  size: pluginConfig.size,
  sizePreset: pluginConfig.sizePreset,
  panelWidth: pluginConfig.panelWidth,
  icon: pluginConfig.icon,
};
