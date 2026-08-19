import { describe, it, expect, beforeEach } from 'vitest';
import visua11yAgent from '../../../src/core';
import { pluginConfig } from '../../../src/config/pluginConfig';
import { userSettings } from '../../../src/config/userSettings';

describe('Core Languages Option Handling', () => {
  beforeEach(() => {
    userSettings.lang = undefined;
    pluginConfig.languages = undefined;
  });

  it('should initialize with provided languages array', () => {
    visua11yAgent({ options: { languages: ['id', 'ru'], lang: 'id' } });
    expect(pluginConfig.languages).toEqual(['id', 'ru']);
    expect(userSettings.lang).toBe('id');
  });

  it('should fallback to first allowed language if requested lang is not in whitelist', () => {
    visua11yAgent({ options: { languages: ['id', 'ru'], lang: 'fr' } });
    expect(userSettings.lang).toBe('id');
  });

  it('should accept comma-separated string for languages', () => {
    visua11yAgent({ options: { languages: 'en, id, ja' } });
    expect(pluginConfig.languages).toEqual(['en', 'id', 'ja']);
  });

  it('should support direct flat options object without options wrapper', () => {
    visua11yAgent({ languages: ['id', 'en'], lang: 'id' });
    expect(pluginConfig.languages).toEqual(['id', 'en']);
    expect(userSettings.lang).toBe('id');
  });
});
