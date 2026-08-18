import { changeLanguage, _suppressHTMLLangObserver } from '@/i18n/changeLanguage';
import { getDefaultLanguage } from '@/i18n/getDefaultLanguage';

export default function observeHTMLLang() {
  const htmlEl = document.documentElement;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        // Ignore mutations triggered by the widget itself to avoid a feedback loop
        if (_suppressHTMLLangObserver) {
          continue;
        }
        changeLanguage(getDefaultLanguage());
      }
    }
  });

  observer.observe(htmlEl, { attributes: true });
}
