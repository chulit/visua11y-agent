import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import readableFont, { readableFontConfig } from '../../../src/tools/readableFont';
import { injectToolCSS } from '../../../src/utils/cssGenerator';

// Mock the cssGenerator module
vi.mock('../../../src/utils/cssGenerator', () => ({
  injectToolCSS: vi.fn(),
}));

describe('readableFont', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('readableFontConfig', () => {
    it('should have the correct id', () => {
      expect(readableFontConfig.id).toBe('readable-font');
    });

    it('should have the correct selector', () => {
      expect(readableFontConfig.selector).toBe('html');
    });

    it('should have the correct childrenSelector', () => {
      expect(readableFontConfig.childrenSelector).toEqual(['body :where(:not(.visua11y-agent-container):not(.visua11y-agent-container *))']);
    });

    it('should have the correct styles for dyslexia-friendly font', () => {
      expect(readableFontConfig.styles).toEqual({
        'font-family': 'OpenDyslexic3,Comic Sans MS,Arial,Helvetica,sans-serif',
      });
    });

    it('should have the correct CSS for font-face definition', () => {
      expect(readableFontConfig.css).toContain('@font-face');
      expect(readableFontConfig.css).toContain('font-family: OpenDyslexic3');
      expect(readableFontConfig.css).toContain('https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.woff');
    });
  });

  describe('readableFont function', () => {
    it('should call injectToolCSS with readableFontConfig and enable set to true when called with true', () => {
      readableFont(true);
      
      expect(injectToolCSS).toHaveBeenCalledWith({
        ...readableFontConfig,
        enable: true,
      });
    });

    it('should call injectToolCSS with readableFontConfig and enable set to false when called with false', () => {
      readableFont(false);
      
      expect(injectToolCSS).toHaveBeenCalledWith({
        ...readableFontConfig,
        enable: false,
      });
    });

    it('should call injectToolCSS with readableFontConfig and enable set to false when called without parameters (default)', () => {
      readableFont();
      
      expect(injectToolCSS).toHaveBeenCalledWith({
        ...readableFontConfig,
        enable: false,
      });
    });

    it('should preserve all original config properties when spreading readableFontConfig', () => {
      readableFont(true);
      
      const callArgs = (injectToolCSS as vi.Mock).mock.calls[0][0];
      expect(callArgs.id).toBe(readableFontConfig.id);
      expect(callArgs.selector).toBe(readableFontConfig.selector);
      expect(callArgs.childrenSelector).toEqual(readableFontConfig.childrenSelector);
      expect(callArgs.styles).toEqual(readableFontConfig.styles);
      expect(callArgs.css).toBe(readableFontConfig.css);
      expect(callArgs.enable).toBe(true);
    });
  });
});