import { userSettings } from '@/config/userSettings';

import stopAnimations from '@/tools/stopAnimations';
import readableFont from '@/tools/readableFont';
import bigCursor from '@/tools/bigCursor';
import highlightTitle from '@/tools/highlightTitle';
import readingGuide from '@/tools/readingGuide';
import highlightLinks from '@/tools/highlightLinks';
import adjustLetterSpacing from '@/tools/adjustLetterSpacing';
import adjustLineHeight from '@/tools/adjustLineHeight';
import adjustFontWeight from '@/tools/adjustFontWeight';
import screenReader from '@/tools/screenReader';
import voiceNavigation from '@/tools/voiceNavigation';
import customPalette from '@/tools/customPalette';

export default function renderTools() {
  const states = userSettings?.states || {};

  highlightTitle(Boolean(states['highlight-title']));
  highlightLinks(Boolean(states['highlight-links']));

  adjustLetterSpacing(Boolean(states['letter-spacing']));
  adjustLineHeight(Boolean(states['line-height']));
  adjustFontWeight(Boolean(states['font-weight']));

  readableFont(Boolean(states['readable-font']));

  readingGuide(Boolean(states['readable-guide']));
  stopAnimations(Boolean(states['stop-animations']));
  bigCursor(Boolean(states['big-cursor']));

  screenReader(Boolean(states['screen-reader']));
  voiceNavigation(Boolean(states['voice-navigation']));
  customPalette(states['custom-palette']);
}
