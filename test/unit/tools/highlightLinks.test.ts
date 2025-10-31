import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import highlightLinks, { highlightLinksConfig } from '../../../src/tools/highlightLinks';
import { injectToolCSS } from '../../../src/utils/cssGenerator';
import { LINKS_SELECTORS } from '../../../src/enum/Selectors';

// Mock the cssGenerator module
vi.mock('../../../src/utils/cssGenerator', () => ({
  injectToolCSS: vi.fn(),
}));

describe('highlightLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('highlightLinksConfig', () => {
    it('should have the correct id', () => {
      expect(highlightLinksConfig.id).toBe('highlight-links');
    });

    it('should have the correct selector', () => {
      expect(highlightLinksConfig.selector).toBe('html');
    });

    it('should use LINKS_SELECTORS for childrenSelector', () => {
      expect(highlightLinksConfig.childrenSelector).toEqual(LINKS_SELECTORS);
    });

    it('should have the correct styles for link highlighting', () => {
      expect(highlightLinksConfig.styles).toEqual({
        outline: '2px solid #0048ff',
        'outline-offset': '2px',
      });
    });
  });

  describe('highlightLinks function', () => {
    it('should call injectToolCSS with highlightLinksConfig and enable set to true when called with true', () => {
      highlightLinks(true);
      
      expect(injectToolCSS).toHaveBeenCalledWith({
        ...highlightLinksConfig,
        enable: true,
      });
    });

    it('should call injectToolCSS with highlightLinksConfig and enable set to false when called with false', () => {
      highlightLinks(false);
      
      expect(injectToolCSS).toHaveBeenCalledWith({
        ...highlightLinksConfig,
        enable: false,
      });
    });

    it('should call injectToolCSS with highlightLinksConfig and enable set to false when called without parameters (default)', () => {
      highlightLinks();
      
      expect(injectToolCSS).toHaveBeenCalledWith({
        ...highlightLinksConfig,
        enable: false,
      });
    });

    it('should preserve all original config properties when spreading highlightLinksConfig', () => {
      highlightLinks(true);
      
      const callArgs = (injectToolCSS as vi.Mock).mock.calls[0][0];
      expect(callArgs.id).toBe(highlightLinksConfig.id);
      expect(callArgs.selector).toBe(highlightLinksConfig.selector);
      expect(callArgs.childrenSelector).toEqual(highlightLinksConfig.childrenSelector);
      expect(callArgs.styles).toEqual(highlightLinksConfig.styles);
      expect(callArgs.enable).toBe(true);
    });
  });
});