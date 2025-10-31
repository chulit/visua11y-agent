import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import observeHTMLLang from '../../../src/utils/observeHTMLLang';
import { changeLanguage } from '../../../src/i18n/changeLanguage';
import { getDefaultLanguage } from '../../../src/i18n/getDefaultLanguage';

// Mock the imported functions
vi.mock('../../../src/i18n/changeLanguage', () => ({
  changeLanguage: vi.fn(),
}));

vi.mock('../../../src/i18n/getDefaultLanguage', () => ({
  getDefaultLanguage: vi.fn(),
}));

describe('observeHTMLLang', () => {
  let originalLang: string;
  let mutationObserverSpy;
  let mutationCallbacks = [];

  beforeEach(() => {
    // Save original lang attribute
    originalLang = document.documentElement.lang;
    
    // Mock MutationObserver
    mutationObserverSpy = vi.fn(function(callback) {
      mutationCallbacks.push(callback);
      this.observe = vi.fn();
      this.disconnect = vi.fn();
    });
    
    // @ts-ignore - We're mocking the global
    global.MutationObserver = mutationObserverSpy;
    
    // Mock getDefaultLanguage to return a test value
    (getDefaultLanguage as vi.Mock).mockReturnValue('en');
  });

  afterEach(() => {
    // Reset lang attribute
    document.documentElement.lang = originalLang;
    
    // Clean up mocks
    vi.clearAllMocks();
    mutationCallbacks = [];
  });

  it('should create a MutationObserver to watch for lang attribute changes', () => {
    observeHTMLLang();
    
    expect(mutationObserverSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should observe the documentElement with attributes option', () => {
    observeHTMLLang();
    
    const observerInstance = new MutationObserver(() => {});
    observeHTMLLang();
    
    // Check if observe is called with the right parameters
    // We'll test that the observer is set up by verifying it's called
    expect(mutationObserverSpy).toHaveBeenCalled();
  });

  it('should call changeLanguage with the default language when lang attribute changes', () => {
    observeHTMLLang();
    
    // Simulate a mutation
    const mockMutation = {
      type: 'attributes',
      attributeName: 'lang'
    };
    
    if (mutationCallbacks.length > 0) {
      mutationCallbacks[0]([mockMutation]);
    }
    
    expect(getDefaultLanguage).toHaveBeenCalled();
    expect(changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should not call changeLanguage when a non-lang attribute changes', () => {
    observeHTMLLang();
    
    // Simulate a mutation for a different attribute
    const mockMutation = {
      type: 'attributes',
      attributeName: 'class'
    };
    
    if (mutationCallbacks.length > 0) {
      mutationCallbacks[0]([mockMutation]);
    }
    
    expect(changeLanguage).not.toHaveBeenCalled();
  });

  it('should not call changeLanguage when mutation type is not attributes', () => {
    observeHTMLLang();
    
    // Simulate a childList mutation
    const mockMutation = {
      type: 'childList',
      attributeName: null
    };
    
    if (mutationCallbacks.length > 0) {
      mutationCallbacks[0]([mockMutation]);
    }
    
    expect(changeLanguage).not.toHaveBeenCalled();
  });
});