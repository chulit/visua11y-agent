export const pluginConfig = {
  lang: 'en',
  position: 'bottom-left',
  offset: [20, 20],
  size: 58,
  icon: undefined as string | undefined,
};

export const pluginDefaults = {
  lang: pluginConfig.lang,
  position: pluginConfig.position,
  offset: [...pluginConfig.offset],
  size: pluginConfig.size,
  icon: pluginConfig.icon,
};
