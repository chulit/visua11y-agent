import { 
    userSettings
} from '@/globals/userSettings';

import stopAnimations from "@/tools/stopAnimations";
import readableFont from "@/tools/readableFont";
import bigCursor from "@/tools/bigCursor";
import highlightTitle from "@/tools/highlightTitle";
import readingGuide from "@/tools/readingGuide";
import highlightLinks from "@/tools/highlightLinks";
import adjustLetterSpacing from "@/tools/adjustLetterSpacing";
import adjustLineHeight from "@/tools/adjustLineHeight";
import adjustFontWeight from "@/tools/adjustFontWeight";
import screenReader from "@/tools/screenReader";
import voiceNavigation from "@/tools/voiceNavigation";
import customPalette from "@/tools/customPalette";

export default function renderTools() {
    const states = userSettings?.states || {};

    highlightTitle(states['highlight-title']);
    highlightLinks(states['highlight-links']);

    adjustLetterSpacing(states['letter-spacing']);
    adjustLineHeight(states['line-height']);
    adjustFontWeight(states['font-weight']);

    readableFont(states['readable-font']);

    readingGuide(states['readable-guide']);
    stopAnimations(states['stop-animations']);
    bigCursor(states['big-cursor']);

    screenReader(Boolean(states['screen-reader']));
    voiceNavigation(Boolean(states['voice-navigation']));
    customPalette(states['custom-palette']);
}
