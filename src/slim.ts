/**
 * Visua11y Agent - Slim Distribution
 * Lightweight build optimized for minimal bundle size and performance.
 */

import visua11yAgent, { createVisua11yAgent, initVisua11yAgent } from './index';
import type { Visua11yAgentOptions, Visua11yAgentPlugin } from './index';
import type { ISettings } from './types/ISettings';
import type { IRegisterLanguageOptions } from './i18n/Languages';

export { createVisua11yAgent, initVisua11yAgent, visua11yAgent };
export type { Visua11yAgentOptions, Visua11yAgentPlugin, ISettings, IRegisterLanguageOptions };
export default visua11yAgent;
