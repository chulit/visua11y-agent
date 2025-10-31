import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveStorageData, getStorageData } from '../../../src/storage/index';
import { getCookie, setCookie } from '../../../src/utils/cookies';
import { 
  userSettings, 
  saveUserSettings, 
  getSavedUserSettings, 
  setUserStateSettings,
  STORAGE_KEY 
} from '../../../src/config/userSettings';

// Create localStorage mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Apply to global window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock the cookie utilities
vi.mock('../../../src/utils/cookies', () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
}));

describe('storage functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.clear();
    // Reset store object
    Object.keys(localStorageMock).forEach(key => {
      if (typeof localStorageMock[key] === 'function' && key !== 'clear') {
        localStorageMock[key].mockClear();
      }
    });
    
    // Reset userSettings to default values
    userSettings.lang = undefined;
    userSettings.position = undefined;
    userSettings.offset = undefined;
    userSettings.states = {};
  });

  afterEach(() => {
    // Reset localStorage
    localStorageMock.clear();
  });

  describe('saveStorageData', () => {
    it('should save data to localStorage when available', () => {
      const testKey = 'test-key';
      const testValue = { name: 'test', value: 123 };
      
      saveStorageData(testKey, testValue);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(testKey, JSON.stringify(testValue));
      expect(setCookie).not.toHaveBeenCalled();
    });

    it('should use cookie as fallback when localStorage throws an error', () => {
      const testKey = 'test-key';
      const testValue = { name: 'test', value: 123 };
      
      // Temporarily replace setItem with one that throws an error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = vi.fn(() => {
        throw new Error('Storage is disabled');
      });
      
      // Suppress console.error to prevent error messages in test output
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      saveStorageData(testKey, testValue);
      
      expect(setCookie).toHaveBeenCalledWith(testKey, JSON.stringify(testValue));
      
      // Restore original console.error
      console.error = originalConsoleError;
      
      // Restore original
      localStorageMock.setItem = originalSetItem;
    });

    it('should stringify the value before saving', () => {
      const testKey = 'test-key';
      const testValue = { name: 'test', value: [1, 2, 3], nested: { a: 1 } };
      
      saveStorageData(testKey, testValue);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(testKey, JSON.stringify(testValue));
    });

    it('should handle simple data types', () => {
      const testData = [
        { key: 'string-test', value: 'hello' },
        { key: 'number-test', value: 42 },
        { key: 'boolean-test', value: true },
        { key: 'null-test', value: null },
        { key: 'array-test', value: [1, 'two', 3] },
      ];
      
      testData.forEach(({ key, value }) => {
        saveStorageData(key, value);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
      });
    });
  });

  describe('getStorageData', () => {
    it('should retrieve and parse data from localStorage when available', () => {
      const testKey = 'test-key';
      const testValue = { name: 'test', value: 123 };
      
      localStorageMock.setItem(testKey, JSON.stringify(testValue));
      
      const result = getStorageData(testKey);
      
      expect(result).toEqual(testValue);
      expect(getCookie).not.toHaveBeenCalled();
    });

    it('should use cookie as fallback when localStorage throws an error', () => {
      const testKey = 'test-key';
      const testValue = { name: 'test', value: 123 };
      
      // Temporarily replace getItem with one that throws an error
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = vi.fn(() => {
        throw new Error('Storage is disabled');
      });
      
      // Suppress console.error to prevent error messages in test output
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      (getCookie as vi.Mock).mockReturnValue(JSON.stringify(testValue));
      
      const result = getStorageData(testKey);
      
      expect(getCookie).toHaveBeenCalledWith(testKey);
      expect(result).toEqual(testValue);
      
      // Restore original console.error
      console.error = originalConsoleError;
      
      // Restore original
      localStorageMock.getItem = originalGetItem;
    });

    it('should return empty object when data cannot be parsed', () => {
      const testKey = 'test-key';
      
      localStorageMock.setItem(testKey, 'invalid json');
      
      // Suppress console.error to prevent error messages in test output
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      const result = getStorageData(testKey);
      
      expect(result).toEqual({});
      
      // Restore original console.error
      console.error = originalConsoleError;
    });

    it('should return empty object when key does not exist', () => {
      const result = getStorageData('nonexistent-key');
      
      expect(result).toEqual({});
    });

    it('should handle various data types correctly', () => {
      const testData = [
        { key: 'string-test', value: 'hello' },
        { key: 'number-test', value: 42 },
        { key: 'boolean-test', value: true },
        { key: 'null-test', value: null },
        { key: 'array-test', value: [1, 'two', 3] },
        { key: 'object-test', value: { a: 1, b: 'two' } },
      ];
      
      testData.forEach(({ key, value }) => {
        localStorageMock.setItem(key, JSON.stringify(value));
        const result = getStorageData(key);
        expect(result).toEqual(value);
      });
    });
  });

  describe('userSettings configuration', () => {
    it('should have correct initial values', () => {
      expect(userSettings).toEqual({
        lang: undefined,
        position: undefined,
        offset: undefined,
        states: {},
      });
    });

    describe('saveUserSettings', () => {
      it('should save user settings to storage with correct key', () => {
        const testSettings = { lang: 'fr', position: 'top-right', states: { contrast: true } };
        userSettings.lang = testSettings.lang;
        userSettings.position = testSettings.position;
        userSettings.states = testSettings.states;
        
        saveUserSettings();
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(userSettings));
      });
    });

    describe('getSavedUserSettings', () => {
      it('should retrieve user settings from storage with correct key', () => {
        const savedSettings = { lang: 'de', position: 'bottom-left', states: { contrast: false } };
        localStorageMock.setItem(STORAGE_KEY, JSON.stringify(savedSettings));
        
        const result = getSavedUserSettings();
        
        expect(result).toEqual(savedSettings);
      });
    });

    describe('setUserStateSettings', () => {
      it('should update userSettings states with new values and trigger save', () => {
        const initialState = { contrast: true, fontSize: 1.2 };
        const newState = { dyslexiaFont: true, lineSpacing: 1.5 };
        
        userSettings.states = { ...initialState };
        
        // Spy on localStorage to verify save is called
        const setItemSpy = vi.spyOn(localStorageMock, 'setItem');
        
        setUserStateSettings(newState);
        
        expect(userSettings.states).toEqual({
          contrast: true,
          fontSize: 1.2,
          dyslexiaFont: true,
          lineSpacing: 1.5
        });
        
        // Verify that saveUserSettings was called (which uses localStorage.setItem)
        expect(setItemSpy).toHaveBeenCalled();
      });

      it('should merge new state with existing state without replacing the whole object', () => {
        userSettings.states = { existing: 'value' };
        
        setUserStateSettings({ new: 'value' });
        
        expect(userSettings.states).toEqual({
          existing: 'value',
          new: 'value'
        });
      });
    });
  });
});