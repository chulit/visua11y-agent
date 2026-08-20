import visua11yAgent from './core';
import { getDefaultLanguage } from './i18n/getDefaultLanguage';
import { getScriptDataAttribute } from './utils/getScriptDataAttribute';
import observeHTMLLang from './utils/observeHTMLLang';
import { loadLanguages } from '@/i18n/Languages';

async function initialize() {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    document.removeEventListener('readystatechange', initialize);

    const rawOffset = getScriptDataAttribute('offset');
    let parsedOffset: [number, number] | undefined = undefined;
    if (rawOffset) {
      const parts = rawOffset.split(',').map((s) => Number(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsedOffset = [parts[0], parts[1]];
      }
    }

    const options = {
      lang: getDefaultLanguage(),
      languages: getScriptDataAttribute('languages'),
      position: getScriptDataAttribute('position'),
      offset: parsedOffset,
      size: getScriptDataAttribute('size'),
      icon: getScriptDataAttribute('icon'),
    };

    await loadLanguages();
    window.Visua11yAgentPlugin = visua11yAgent({
      options,
    });

    if (!getScriptDataAttribute('disableObserveLang')) {
      observeHTMLLang();
    }
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // Initialize if the script is appended to the DOM when document.readyState is completed
  initialize();
} else {
  // Use readystatechange for async support
  document.addEventListener('readystatechange', initialize);
}
