import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import enableContrast from '../../../src/tools/enableContrast';
import addStylesheet from '../../../src/utils/addStylesheet';
import { generateCSSFromConfig } from '../../../src/utils/cssGenerator';
import { FILTERS } from '../../../src/enum/Filters';

// Mock the imported modules
vi.mock('../../../src/utils/addStylesheet', () => ({
  default: vi.fn(),
}));

vi.mock('../../../src/utils/cssGenerator', () => ({
  generateCSSFromConfig: vi.fn(),
}));

describe('enableContrast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset HTML element classes
    document.documentElement.classList.remove('aws-filter');
  });

  afterEach(() => {
    // Clean up any added style elements
    const existingStyle = document.getElementById('visua11y-agent-filter-style');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  it('should remove the style element and aws-filter class when contrast is invalid', () => {
    // Add a style element to be removed
    const styleElement = document.createElement('style');
    styleElement.id = 'visua11y-agent-filter-style';
    document.head.appendChild(styleElement);
    
    // Add the aws-filter class to be removed
    document.documentElement.classList.add('aws-filter');
    
    enableContrast('invalid-contrast');
    
    expect(document.getElementById('visua11y-agent-filter-style')).toBeNull();
    expect(document.documentElement.classList.contains('aws-filter')).toBe(false);
  });

  it('should call generateCSSFromConfig with the correct filter and selector when contrast is valid', () => {
    const validContrast = 'highContrast';
    const filterData = FILTERS[validContrast];
    
    if (filterData) {
      enableContrast(validContrast);
      
      expect(generateCSSFromConfig).toHaveBeenCalledWith({
        ...filterData,
        selector: 'html.aws-filter',
      });
    }
  });

  it('should call addStylesheet with the generated CSS and correct ID when contrast is valid', () => {
    const validContrast = 'highContrast';
    const expectedCSS = 'body { color: white; }';
    
    (generateCSSFromConfig as vi.Mock).mockReturnValue(expectedCSS);
    
    if (FILTERS[validContrast]) {
      enableContrast(validContrast);
      
      expect(addStylesheet).toHaveBeenCalledWith({
        css: expectedCSS,
        id: 'visua11y-agent-filter-style'
      });
    }
  });

  it('should add the aws-filter class to documentElement when contrast is valid', () => {
    const validContrast = 'highContrast';
    
    if (FILTERS[validContrast]) {
      enableContrast(validContrast);
      
      expect(document.documentElement.classList.contains('aws-filter')).toBe(true);
    }
  });

  it('should work with different contrast modes', () => {
    const contrastModes = Object.keys(FILTERS);
    
    for (const contrastMode of contrastModes) {
      // Reset before each test
      document.documentElement.classList.remove('aws-filter');
      const existingStyle = document.getElementById('visua11y-agent-filter-style');
      if (existingStyle) existingStyle.remove();
      
      (generateCSSFromConfig as vi.Mock).mockReturnValue(`.${contrastMode} { test: true; }`);
      
      enableContrast(contrastMode);
      
      expect(generateCSSFromConfig).toHaveBeenCalledWith({
        ...FILTERS[contrastMode],
        selector: 'html.aws-filter',
      });
      expect(addStylesheet).toHaveBeenCalled();
      expect(document.documentElement.classList.contains('aws-filter')).toBe(true);
    }
  });

  it('should not call generateCSSFromConfig or addStylesheet when contrast is invalid', () => {
    enableContrast('invalid-contrast');
    
    expect(generateCSSFromConfig).not.toHaveBeenCalled();
    expect(addStylesheet).not.toHaveBeenCalled();
  });
});