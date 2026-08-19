import { describe, it, expect } from 'vitest';
import { 
  resolveAllowedLanguages, 
  getAvailableLanguages, 
  isLanguageAllowed 
} from '../../../src/i18n/Languages';

describe('Language Whitelist Helpers', () => {
  it('should parse array of language codes correctly', () => {
    const list = resolveAllowedLanguages(['en', 'id', 'RU']);
    expect(list).toEqual(['en', 'id', 'ru']);
  });

  it('should parse comma-separated string correctly', () => {
    const list = resolveAllowedLanguages('en, id, ru, fr');
    expect(list).toEqual(['en', 'id', 'ru', 'fr']);
  });

  it('should return undefined when no whitelist is passed', () => {
    expect(resolveAllowedLanguages(undefined)).toBeUndefined();
    expect(resolveAllowedLanguages([])).toBeUndefined();
    expect(resolveAllowedLanguages('')).toBeUndefined();
  });

  it('should filter available languages based on whitelist', () => {
    const available = getAvailableLanguages(['en', 'id']);
    expect(available).toHaveLength(2);
    expect(available.map(l => l.code)).toEqual(['en', 'id']);
  });

  it('should return all languages if whitelist is empty or undefined', () => {
    const available = getAvailableLanguages(undefined);
    expect(available.length).toBeGreaterThan(50);
  });

  it('should check if language is allowed', () => {
    expect(isLanguageAllowed('id', ['en', 'id'])).toBe(true);
    expect(isLanguageAllowed('fr', ['en', 'id'])).toBe(false);
    expect(isLanguageAllowed('fr', undefined)).toBe(true);
  });
});
