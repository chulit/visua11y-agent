import { LANGUAGE_DICTIONARY, resolveLanguageCode } from './Languages';
import { userSettings } from '../config/userSettings';

export function t(label: string): string {
  const langCode = resolveLanguageCode(userSettings.lang);
  const dictionary = LANGUAGE_DICTIONARY[langCode] ?? LANGUAGE_DICTIONARY['en'] ?? {};
  return dictionary[label] ?? label;
}
