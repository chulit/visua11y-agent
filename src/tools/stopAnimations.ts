import { injectToolCSS } from '../utils/cssGenerator';
import IToolConfig from '../types/IToolConfig';

export const stopAnimationsConfig: IToolConfig = {
  id: 'stop-animations',
  selector: `html`,
  childrenSelector: ['*', '*::before', '*::after'],
  styles: {
    transition: 'none',
    'animation-fill-mode': 'forwards',
    'animation-iteration-count': '1',
    'animation-duration': '.01s',
    'animation-play-state': 'paused',
  },
};

export default function stopAnimations(enable = false) {
  injectToolCSS({
    ...stopAnimationsConfig,
    enable,
  });
}
