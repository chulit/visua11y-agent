import { saveUserSettings, userSettings } from '@/config/userSettings';
import { LANGUAGES, resolveLanguageCode, loadLanguage } from './Languages';
import translateWidget from '@/components/menu/translateWidget';
import { $menu } from '@/components/menu/menu';

// Flag to suppress the MutationObserver re-triggering when we set html[lang] ourselves
export let _suppressHTMLLangObserver = false;


export async function changeLanguage(newLang: string): Promise<void> {
  const resolvedCode = resolveLanguageCode(newLang);

  if (!LANGUAGES.some((language) => language.code === resolvedCode)) {
    return;
  }

  if (userSettings.lang !== resolvedCode) {
    userSettings.lang = resolvedCode;

    const $lang = $menu?.querySelector<HTMLSelectElement>('#visua11y-agent-language');
    if ($lang) {
      $lang.value = resolvedCode;
    }

    if (typeof document !== 'undefined' && document.documentElement) {
      _suppressHTMLLangObserver = true;
      document.documentElement.lang = resolvedCode;
      // Allow a microtask to flush so MutationObserver fires while flag is still set
      await Promise.resolve();
      _suppressHTMLLangObserver = false;
    }

    // Ensure dictionary is loaded before re-rendering labels
    await loadLanguage(resolvedCode);
    translateWidget();
    saveUserSettings();
  }

  if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
    document.dispatchEvent(
      new CustomEvent('visua11y-agent:language:changed', { detail: { code: resolvedCode } })
    );
  }
}
