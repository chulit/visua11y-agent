/**
 * Visua11y Agent - Universal Accessibility Widget
 * 
 * This module can be used in multiple ways:
 * 
 * 1. ES Module Import:
 *    import { createVisua11yAgent } from 'visua11y-agent';
 *    const plugin = createVisua11yAgent({ lang: 'en' });
 * 
 * 2. Named Import:
 *    import visua11yAgent from 'visua11y-agent';
 *    const plugin = visua11yAgent({ options: { lang: 'en' } });
 * 
 * 3. CDN / UMD (auto-attaches to window):
 *    <script src="https://cdn.jsdelivr.net/npm/visua11y-agent/dist/visua11y-agent.umd.js"></script>
 *    window.Visua11yAgentPlugin.setWidgetSize('small');
 */

import visua11yAgent from './core';
import type { ISettings } from './types/ISettings';
import type { IRegisterLanguageOptions } from './i18n/Languages';

export interface Visua11yAgentOptions {
  lang?: string;
  languages?: string[] | string;
  position?: string;
  offset?: number[] | string;
  size?: string;
  icon?: string;
}

export interface Visua11yAgentPlugin {
  changeLanguage: (code: string) => void;
  setIcon: (html?: string) => void;
  setWidgetSize: (size: string) => void;
  setPosition: (position: string) => void;
  setOffset: (offset: number[] | string) => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleTool: (key: string, enable?: boolean) => void;
  setProfile: (profileId: string) => void;
  getSettings: () => ISettings;
  hideFooter: (hide: boolean) => void;
  setFooterSize: (size: 'small' | 'medium' | 'large') => void;
  registerLanguage: (options: IRegisterLanguageOptions) => string;
  resetAll: () => void;
}

/**
 * Create a new Visua11y Agent instance
 * 
 * @param options - Configuration options for the widget
 * @returns Plugin API for controlling the widget
 * 
 * @example
 * ```typescript
 * import { createVisua11yAgent } from 'visua11y-agent';
 * 
 * const plugin = createVisua11yAgent({
 *   lang: 'id',
 *   position: 'bottom-right',
 *   size: 'medium'
 * });
 * 
 * plugin.setWidgetSize('small');
 * plugin.openMenu();
 * ```
 */
export function createVisua11yAgent(options?: Visua11yAgentOptions): Visua11yAgentPlugin {
  return visua11yAgent({ options: options || {} });
}

/**
 * Initialize Visua11y Agent with auto-detection of script attributes
 * This is used internally by the UMD bundle
 * 
 * @internal
 */
export function initVisua11yAgent(options: { options: Visua11yAgentOptions }): Visua11yAgentPlugin {
  return visua11yAgent(options);
}

// Default export for backward compatibility
export default visua11yAgent;

// Re-export core function with different name for clarity
export { visua11yAgent };

// Export version
export { VERSION, VERSION as version } from './version';

// Export i18n utilities and locales
export { ALL_LOCALES, enLocale, idLocale } from './i18n/locales';
export { registerLanguage, loadLanguage, LANGUAGES } from './i18n/Languages';

// Export types
export type { ISettings } from './types/ISettings';
export type { IRegisterLanguageOptions, ILanguage } from './i18n/Languages';
