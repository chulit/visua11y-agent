export const LANGUAGES: ILanguage[] = [
  { code: 'am', label: 'አማርኛ (Amharic)' },
  { code: 'ar', label: 'العربية (Arabic)' },
  { code: 'bg', label: 'български (Bulgarian)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'ca', label: 'Català (Catalan)' },
  { code: 'cs', label: 'čeština (Czech)' },
  { code: 'da', label: 'Danish (Denmark)' },
  { code: 'de', label: 'Deutsch (German)' },
  { code: 'el', label: 'Ελληνικά (Greek)' },
  { code: 'en', label: 'English (English)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'fa', label: 'فارسی (Persian)' },
  { code: 'fi', label: 'suomi (Finnish)' },
  { code: 'fil', label: 'Tagalog (Filipno)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'he', label: 'עברית (Hebrew)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'hr', label: 'Hrvatski (Croatian)' },
  { code: 'hu', label: 'Magyar (Hungarian)' },
  { code: 'id', label: 'Bahasa Indonesia (Indonesian)' },
  { code: 'it', label: 'Italiano (Italian)' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'ka', label: 'ქართული (Georgian)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ko', label: '한국어 (Korean)' },
  { code: 'ku', label: 'Kurdî (Kurdish)' },
  { code: 'lb', label: 'Lëtzebuergesch (Luxembourgish)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'mn', label: 'Монгол (Mongolian)' },
  { code: 'ms', label: 'Bahasa Malaysia (Malay)' },
  { code: 'my', label: 'မြန်မာ (Burmese)' },
  { code: 'nl', label: 'Nederlands (Dutch)' },
  { code: 'no', label: 'Norsk (Norwegian)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'pl', label: 'Polski (Polish)' },
  { code: 'pt', label: 'Português (Portuguese)' },
  { code: 'ro', label: 'Română (Romanian)' },
  { code: 'ru', label: 'Русский (Russian)' },
  { code: 'si', label: 'සිංහල (Sinhala)' },
  { code: 'sk', label: 'slovenčina (Slovak)' },
  { code: 'sl', label: 'slovenščina (Slovenian)' },
  { code: 'sr', label: 'Srpski (Serbian)' },
  { code: 'sr-SP', label: 'Српски (Serbian Cyrillic)' },
  { code: 'sv', label: 'Svenska (Swedish)' },
  { code: 'sw', label: 'Kiswahili (Swahili)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'th', label: 'ไทย (Thai)' },
  { code: 'tr', label: 'Türkçe (Turkish)' },
  { code: 'ur', label: 'اردو (Urdu)' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)' },
  { code: 'zh-Hans', label: '简体中文 (Simplified Chinese)' },
  { code: 'zh-Hant', label: '繁體中文 (Traditional Chinese)' },
];

export interface ILanguage {
    code: string;
    label: string;
}

export interface IRegisterLanguageOptions {
    code: string;
    label?: string;
    dictionary: Record<string, string>;
    merge?: boolean;
}

export const LANGUAGE_DICTIONARY: Record<string, Record<string, string>> = {};

function normalizeCode(code: string): string {
  return String(code || '').trim();
}

export function findLanguage(code: string): ILanguage | undefined {
  const normalized = normalizeCode(code).toLowerCase();
  return LANGUAGES.find((lang) => lang.code.toLowerCase() === normalized);
}

export function resolveLanguageCode(code?: string | null): string {
  const normalized = normalizeCode(code || '');
  if (!normalized) {
    return 'en';
  }

  const exactMatch = findLanguage(normalized);
  if (exactMatch) {
    return exactMatch.code;
  }

  const shortCode = normalized.split(/[-_]/)[0];
  if (shortCode) {
    const partialMatch = findLanguage(shortCode);
    if (partialMatch) {
      return partialMatch.code;
    }
  }

  return 'en';
}

export async function loadLanguages(): Promise<void> {
  for (const { code } of LANGUAGES) {
    if (LANGUAGE_DICTIONARY[code]) {
      continue;
    }

    try {
      const dictionary = (await import(`../locales/${code}.json`)).default;
      LANGUAGE_DICTIONARY[code] = dictionary;
    } catch (error) {
      console.warn(`[Visua11y Agent] Missing locale file for "${code}"`, error);
      LANGUAGE_DICTIONARY[code] = LANGUAGE_DICTIONARY[code] || {};
    }
  }
}

export function registerLanguage({
  code,
  label,
  dictionary,
  merge,
}: IRegisterLanguageOptions): string | undefined {
  const resolvedCode = normalizeCode(code);
  if (!resolvedCode) {
    console.warn('[Visua11y Agent] registerLanguage requires a non-empty language code.');
    return undefined;
  }

  const existing = findLanguage(resolvedCode);
  if (!existing) {
    LANGUAGES.push({
      code: resolvedCode,
      label: label || resolvedCode,
    });
  } else if (label && existing.label !== label) {
    existing.label = label;
  }

  const safeDictionary = dictionary || {};
  const currentDictionary = LANGUAGE_DICTIONARY[resolvedCode] || {};
  LANGUAGE_DICTIONARY[resolvedCode] = merge
    ? { ...currentDictionary, ...safeDictionary }
    : { ...safeDictionary };

  if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
    document.dispatchEvent(
      new CustomEvent('visua11y-agent:languages:updated', { detail: { code: resolvedCode } })
    );
  }

  return resolvedCode;
}
