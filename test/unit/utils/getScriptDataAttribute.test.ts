import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getScriptDataAttribute } from '../../../src/utils/getScriptDataAttribute';

describe('getScriptDataAttribute', () => {
  let originalCurrentScript: any;

  beforeEach(() => {
    // Save original document.currentScript
    originalCurrentScript = document.currentScript;
    
    // Create a test script element
    const testScript = document.createElement('script');
    testScript.setAttribute('data-visua11y-agent-test', 'testValue');
    testScript.setAttribute('data-visua11y-agent-other', 'otherValue');
    document.head.appendChild(testScript);
    
    // Mock document.currentScript for tests that need it
    Object.defineProperty(document, 'currentScript', {
      value: testScript,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up test scripts
    const testScripts = document.querySelectorAll('script[data-visua11y-agent-test], script[data-visua11y-agent-other]');
    testScripts.forEach(script => script.remove());
    
    // Also remove any other test scripts added during tests
    const fallbackScripts = document.querySelectorAll('script[data-visua11y-agent-fallback], script[data-visua11y-agent-position]');
    fallbackScripts.forEach(script => script.remove());
    
    // Restore original document.currentScript
    Object.defineProperty(document, 'currentScript', {
      value: originalCurrentScript,
      writable: true,
    });
  });

  it('should return attribute value from document.currentScript if it exists', () => {
    const result = getScriptDataAttribute('test');
    expect(result).toBe('testValue');
  });

  it('should return attribute value from the first matching script element if currentScript does not have the attribute', () => {
    // Temporarily modify currentScript to not have the test attribute
    const originalScript = document.currentScript;
    const scriptWithoutAttr = document.createElement('script');
    Object.defineProperty(document, 'currentScript', {
      value: scriptWithoutAttr,
      writable: true,
    });

    const result = getScriptDataAttribute('other');
    expect(result).toBe('otherValue');

    // Restore original currentScript for other tests
    Object.defineProperty(document, 'currentScript', {
      value: originalScript,
      writable: true,
    });
  });

  it('should return undefined if the attribute does not exist anywhere', () => {
    const result = getScriptDataAttribute('nonexistent');
    expect(result).toBeUndefined();
  });

  it('should correctly format the attribute name', () => {
    const testScript = document.createElement('script');
    testScript.setAttribute('data-visua11y-agent-position', 'bottom-right');
    document.head.appendChild(testScript);

    const originalScript = document.currentScript;
    Object.defineProperty(document, 'currentScript', {
      value: testScript,
      writable: true,
    });

    const result = getScriptDataAttribute('position');
    expect(result).toBe('bottom-right');

    // Clean up - testScript already gets cleaned up in afterEach
    Object.defineProperty(document, 'currentScript', {
      value: originalScript,
      writable: true,
    });
  });

  it('should work when document.currentScript is null', () => {
    const originalScript = document.currentScript;
    Object.defineProperty(document, 'currentScript', {
      value: null,
      writable: true,
    });

    const fallbackScript = document.createElement('script');
    fallbackScript.setAttribute('data-visua11y-agent-fallback', 'fallbackValue');
    document.head.appendChild(fallbackScript);

    const result = getScriptDataAttribute('fallback');
    expect(result).toBe('fallbackValue');

    // Clean up happens in afterEach
    Object.defineProperty(document, 'currentScript', {
      value: originalScript,
      writable: true,
    });
  });
});