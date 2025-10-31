import { injectToolCSS } from '../utils/cssGenerator';
import { ALL_ELEMENT_SELECTORS } from '../enum/Selectors';
import IToolConfig from '../types/IToolConfig';

export const adjustLetterSpacingConfig: IToolConfig = {
  id: 'letter-spacing',
  selector: `html`,
  childrenSelector: ALL_ELEMENT_SELECTORS.map(s => `${s}:not(.visua11y-agent-container *)`),
  styles: {
    'letter-spacing': '2px',
  },
};

export default function adjustLetterSpacing(enable = false) {
  injectToolCSS({
    ...adjustLetterSpacingConfig,
    enable,
  });
}
