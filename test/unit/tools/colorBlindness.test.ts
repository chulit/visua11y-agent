import { describe, it, expect, beforeEach } from 'vitest';
import { 
  applyColorBlindness, 
  removeColorBlindness, 
  COLOR_BLINDNESS_TYPES 
} from '../../../src/tools/colorBlindness';

describe('Color Blindness Tool', () => {
  beforeEach(() => {
    removeColorBlindness();
    document.body.innerHTML = '<div class="content">Text</div>';
  });

  it('should list all 4 supported color blindness types', () => {
    expect(COLOR_BLINDNESS_TYPES).toEqual([
      'protanopia',
      'deuteranopia',
      'tritanopia',
      'achromatopsia',
    ]);
  });

  it('should inject SVG filter elements into DOM', () => {
    applyColorBlindness('protanopia');
    const svgFilter = document.getElementById('visua11y-color-blindness-svg');
    expect(svgFilter).not.toBeNull();
  });

  it('should apply protanopia filter attribute and stylesheet', () => {
    applyColorBlindness('protanopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('protanopia');
    const style = document.getElementById('visua11y-color-blindness-style');
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain('visua11y-filter-protanopia');
  });

  it('should switch between deuteranopia, tritanopia, and achromatopsia', () => {
    applyColorBlindness('deuteranopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('deuteranopia');

    applyColorBlindness('tritanopia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('tritanopia');

    applyColorBlindness('achromatopsia');
    expect(document.documentElement.getAttribute('data-visua11y-color-blindness')).toBe('achromatopsia');
  });

  it('should clean up SVG filter, style and attributes when removed', () => {
    applyColorBlindness('protanopia');
    removeColorBlindness();
    expect(document.documentElement.hasAttribute('data-visua11y-color-blindness')).toBe(false);
    const svgFilter = document.getElementById('visua11y-color-blindness-svg');
    expect(svgFilter).toBeNull();
  });
});
