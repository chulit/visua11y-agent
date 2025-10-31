import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCSS, wrapCSSToSelector, generateCSSFromConfig, injectToolCSS } from '../../../src/utils/cssGenerator';
import addStylesheet from '../../../src/utils/addStylesheet';
import IToolConfig from '../../../src/types/IToolConfig';

// Mock addStylesheet to prevent DOM manipulation during tests
vi.mock('../../../src/utils/addStylesheet', () => ({
  default: vi.fn(),
}));

describe('cssGenerator', () => {
  describe('generateCSS', () => {
    it('should generate CSS from a style object', () => {
      const styles = { 'color': 'red', 'font-size': '16px' };
      const expected = 'color:red !important;font-size:16px !important;';
      expect(generateCSS(styles)).toBe(expected);
    });

    it('should apply browser prefixes for specific properties', () => {
      const styles = { 'filter': 'blur(5px)' };
      const expected = '-o-filter:blur(5px) !important;-ms-filter:blur(5px) !important;-moz-filter:blur(5px) !important;-webkit-filter:blur(5px) !important;filter:blur(5px) !important;';
      expect(generateCSS(styles)).toBe(expected);
    });

    it('should return an empty string for an empty style object', () => {
      const styles = {};
      expect(generateCSS(styles)).toBe('');
    });
  });

  describe('wrapCSSToSelector', () => {
    it('should wrap CSS with a single selector and children selector', () => {
      const args = {
        selector: 'body',
        childrenSelector: ['p'],
        css: 'color:blue;',
      };
      const expected = 'body p{color:blue;}';
      expect(wrapCSSToSelector(args)).toBe(expected);
    });

    it('should wrap CSS with multiple children selectors', () => {
      const args = {
        selector: 'html',
        childrenSelector: ['h1', 'h2'],
        css: 'font-weight:bold;',
      };
      const expected = 'html h1{font-weight:bold;}html h2{font-weight:bold;}';
      expect(wrapCSSToSelector(args)).toBe(expected);
    });

    it('should handle empty childrenSelector by applying to the main selector', () => {
      const args = {
        selector: 'body',
        childrenSelector: [''],
        css: 'margin:0;',
      };
      const expected = 'body {margin:0;}';
      expect(wrapCSSToSelector(args)).toBe(expected);
    });
  });

  describe('generateCSSFromConfig', () => {
    it('should generate CSS from a tool config', () => {
      const config: IToolConfig = {
        id: 'test-tool',
        selector: 'body',
        childrenSelector: ['p'],
        styles: { 'color': 'green' },
      };
      const expected = 'body p{color:green !important;}';
      expect(generateCSSFromConfig(config)).toBe(expected);
    });

    it('should include additional css from config', () => {
      const config: IToolConfig = {
        id: 'test-tool',
        selector: 'body',
        childrenSelector: ['p'],
        styles: { 'color': 'green' },
        css: 'body{background-color: black;}'
      };
      const expected = 'body p{color:green !important;}body{background-color: black;}';
      expect(generateCSSFromConfig(config)).toBe(expected);
    });

    it('should return empty string if no styles and no css', () => {
      const config: IToolConfig = {
        id: 'test-tool',
        selector: 'body',
        childrenSelector: ['p'],
      };
      expect(generateCSSFromConfig(config)).toBe('');
    });
  });

  describe('injectToolCSS', () => {
    beforeEach(() => {
      // Reset mocks before each test
      vi.clearAllMocks();
      document.head.innerHTML = ''; // Clear head content
    });

    it('should inject CSS when enable is true', () => {
      const config: IToolConfig = {
        id: 'test-tool',
        selector: 'body',
        childrenSelector: ['p'],
        styles: { 'color': 'blue' },
      };
      injectToolCSS({ ...config, enable: true });

      expect(addStylesheet).toHaveBeenCalledTimes(1);
      expect(addStylesheet).toHaveBeenCalledWith({
        css: 'body p{color:blue !important;}',
        id: 'visua11y-agent-test-tool',
      });
      expect(document.documentElement.classList.contains('visua11y-agent-test-tool')).toBe(true);
    });

    it('should remove CSS when enable is false', () => {
      const config: IToolConfig = {
        id: 'test-tool',
        selector: 'body',
        childrenSelector: ['p'],
        styles: { 'color': 'blue' },
      };

      // Simulate CSS being present
      const styleElement = document.createElement('style');
      styleElement.id = 'visua11y-agent-test-tool';
      document.head.appendChild(styleElement);
      document.documentElement.classList.add('visua11y-agent-test-tool');

      injectToolCSS({ ...config, enable: false });

      expect(addStylesheet).not.toHaveBeenCalled();
      expect(document.getElementById('visua11y-agent-test-tool')).toBeNull();
      expect(document.documentElement.classList.contains('visua11y-agent-test-tool')).toBe(false);
    });

    it('should handle config with no styles and no css property', () => {
      const config: IToolConfig = {
        id: 'test-tool',
        selector: 'body',
        childrenSelector: ['p'],
      };
      injectToolCSS({ ...config, enable: true });

      // This will still call addStylesheet with an empty CSS string
      expect(addStylesheet).toHaveBeenCalledWith({
        css: '', // Empty CSS string
        id: 'visua11y-agent-test-tool',
      });
      expect(document.documentElement.classList.contains('visua11y-agent-test-tool')).toBe(true);
    });
  });
});