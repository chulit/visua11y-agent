/**
 * Visua11y Agent - Slim Distribution
 * Lightweight build optimized for minimal bundle size and performance.
 */

import visua11yAgent, {
  createVisua11yAgent,
  initVisua11yAgent,
  VERSION,
  version,
  ALL_LOCALES,
  enLocale,
  idLocale,
  registerLanguage,
  loadLanguage,
  LANGUAGES,
} from './index';
import type { Visua11yAgentOptions, Visua11yAgentPlugin } from './index';
import type { ISettings } from './types/ISettings';
import type { IRegisterLanguageOptions, ILanguage } from './i18n/Languages';

export {
  createVisua11yAgent,
  initVisua11yAgent,
  visua11yAgent,
  VERSION,
  version,
  ALL_LOCALES,
  enLocale,
  idLocale,
  registerLanguage,
  loadLanguage,
  LANGUAGES,
};
export type { Visua11yAgentOptions, Visua11yAgentPlugin, ISettings, IRegisterLanguageOptions, ILanguage };
export default visua11yAgent;
