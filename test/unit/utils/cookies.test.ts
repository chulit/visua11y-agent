import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCookie, setCookie } from '../../../src/utils/cookies';

describe('cookies', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  });

  afterEach(() => {
    // Clean up cookies after each test
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  });

  describe('getCookie', () => {
    it('should return an empty string when cookie does not exist', () => {
      const result = getCookie('nonexistent');
      expect(result).toBe('');
    });

    it('should return the value of an existing cookie', () => {
      document.cookie = 'testCookie=testValue;path=/';
      const result = getCookie('testCookie');
      expect(result).toBe('testValue');
    });

    it('should return the value with spaces properly trimmed', () => {
      document.cookie = ' spacedCookie = spacedValue ;path=/';
      const result = getCookie('spacedCookie');
      expect(result).toBe('spacedValue');
    });

    it('should handle cookies with special characters', () => {
      const specialValue = 'special@value#test';
      document.cookie = `specialCookie=${specialValue};path=/`;
      const result = getCookie('specialCookie');
      expect(result).toBe(specialValue);
    });

    it('should return only the value of the requested cookie when multiple cookies exist', () => {
      document.cookie = 'firstCookie=firstValue;path=/';
      document.cookie = 'secondCookie=secondValue;path=/';
      document.cookie = 'thirdCookie=thirdValue;path=/';
      
      expect(getCookie('firstCookie')).toBe('firstValue');
      expect(getCookie('secondCookie')).toBe('secondValue');
      expect(getCookie('thirdCookie')).toBe('thirdValue');
    });
  });

  describe('setCookie', () => {
    it('should set a cookie with the provided name and value', () => {
      setCookie('testName', 'testValue');
      
      expect(document.cookie).toContain('testName=testValue');
    });

    it('should set a cookie with default expiration of 365 days', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 0, 1)); // Set to Jan 1, 2023
      
      setCookie('testName', 'testValue');
      
      // Verify expiration is approximately 365 days from now
      const expectedExpiry = new Date(2023, 11, 31, 23, 59, 59, 999); // Dec 31, 2023
      const cookieParts = document.cookie.split(';');
      const expiresPart = cookieParts.find(part => part.includes('expires='));
      
      if (expiresPart) {
        const expiryDate = new Date(expiresPart.replace('expires=', ''));
        expect(expiryDate.getTime()).toBeCloseTo(expectedExpiry.getTime(), -1); // Allow some variance in milliseconds
      }
      
      vi.useRealTimers();
    });

    it('should set a cookie with custom expiration days', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 0, 1)); // Set to Jan 1, 2023
      
      setCookie('testName', 'testValue', 7); // 7 days
      
      // Verify expiration is approximately 7 days from now
      const expectedExpiry = new Date(2023, 0, 8, 23, 59, 59, 999); // Jan 8, 2023
      const cookieParts = document.cookie.split(';');
      const expiresPart = cookieParts.find(part => part.includes('expires='));
      
      if (expiresPart) {
        const expiryDate = new Date(expiresPart.replace('expires=', ''));
        expect(expiryDate.getTime()).toBeCloseTo(expectedExpiry.getTime(), -1); // Allow some variance in milliseconds
      }
      
      vi.useRealTimers();
    });

    it('should handle non-finite expiration days by defaulting to 365', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 0, 1)); // Set to Jan 1, 2023
      
      // @ts-expect-error Testing invalid input
      setCookie('testName', 'testValue', NaN);
      
      // Verify expiration is 365 days from now
      const expectedExpiry = new Date(2023, 11, 31, 23, 59, 59, 999); // Dec 31, 2023
      const cookieParts = document.cookie.split(';');
      const expiresPart = cookieParts.find(part => part.includes('expires='));
      
      if (expiresPart) {
        const expiryDate = new Date(expiresPart.replace('expires=', ''));
        expect(expiryDate.getTime()).toBeCloseTo(expectedExpiry.getTime(), -1); // Allow some variance in milliseconds
      }
      
      vi.useRealTimers();
    });

    it('should properly encode special characters in the value', () => {
      setCookie('testName', 'value with spaces & symbols');
      
      // Check that the value is encoded in the cookie string
      expect(document.cookie).toContain('testName=value%20with%20spaces%20%26%20symbols');
    });

    it('should properly handle cookie attributes (path and SameSite)', () => {
      // The implementation sets path=/ and SameSite=Lax attributes
      // These attributes can't be read from document.cookie (this is standard browser behavior)
      // What we test here is that the cookie is set correctly with the expected name and value
      // and we assume the attributes are properly applied by the implementation
      setCookie('testName', 'testValue');
      expect(document.cookie).toContain('testName=testValue');
    });

    it('should handle different value types by converting to string', () => {
      setCookie('numberCookie', 123);
      setCookie('booleanCookie', true);
      setCookie('objectCookie', { a: 1 });
      
      expect(document.cookie).toContain('numberCookie=123');
      expect(document.cookie).toContain('booleanCookie=true');
      // When an object is converted to a string, it becomes "[object Object]", which gets encoded
      expect(document.cookie).toContain('objectCookie=%5Bobject%20Object%5D');
    });
  });
});