import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import adjustFontSize from '../../../src/tools/adjustFontSize';

describe('adjustFontSize', () => {
  const originalElements: HTMLElement[] = [];

  beforeEach(() => {
    // Create some test elements
    const container = document.createElement('div');
    container.className = 'visua11y-agent-container';
    
    const h1 = document.createElement('h1');
    h1.textContent = 'Test Header';
    h1.style.fontSize = '24px';
    
    const p = document.createElement('p');
    p.textContent = 'Test paragraph';
    p.style.fontSize = '16px';
    
    const iconElement = document.createElement('span');
    iconElement.className = 'fa'; // Font Awesome icon class that should be skipped
    iconElement.textContent = 'Icon';
    
    const widgetElement = document.createElement('div');
    widgetElement.className = 'visua11y-agent-container';
    const childP = document.createElement('p');
    childP.textContent = 'Widget child paragraph';
    childP.style.fontSize = '14px';
    widgetElement.appendChild(childP);
    
    // Add to DOM
    document.body.appendChild(container);
    document.body.appendChild(h1);
    document.body.appendChild(p);
    document.body.appendChild(iconElement);
    document.body.appendChild(widgetElement);
    
    originalElements.push(container, h1, p, iconElement, widgetElement, childP);
  });

  afterEach(() => {
    // Clean up test elements
    originalElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    originalElements.length = 0;
  });

  it('should increase font size by the multiplication factor', () => {
    const pElement = document.querySelector('p:not(.visua11y-agent-container p)') as HTMLElement;
    
    adjustFontSize(1.5);
    
    const computedStyle = window.getComputedStyle(pElement);
    expect(computedStyle.fontSize).toBe('24px'); // 16px * 1.5
  });

  it('should decrease font size by the multiplication factor', () => {
    const h1Element = document.querySelector('h1') as HTMLElement;
    
    adjustFontSize(0.5);
    
    const computedStyle = window.getComputedStyle(h1Element);
    expect(computedStyle.fontSize).toBe('12px'); // 24px * 0.5
  });

  it('should not affect elements inside .visua11y-agent-container', () => {
    const widgetPElement = document.querySelector('.visua11y-agent-container p') as HTMLElement;
    const originalSize = window.getComputedStyle(widgetPElement).fontSize;
    
    adjustFontSize(2);
    
    const newSize = window.getComputedStyle(widgetPElement).fontSize;
    expect(newSize).toBe(originalSize); // Should remain unchanged
  });

  it('should not affect icon elements', () => {
    const iconElement = document.querySelector('.fa') as HTMLElement;
    const originalSize = window.getComputedStyle(iconElement).fontSize;
    
    adjustFontSize(2);
    
    const newSize = window.getComputedStyle(iconElement).fontSize;
    expect(newSize).toBe(originalSize); // Should remain unchanged
  });

  it('should store original font size in data attribute on first call', () => {
    const pElement = document.querySelector('p:not(.visua11y-agent-container p)') as HTMLElement;
    
    adjustFontSize(1.2);
    
    expect(pElement.dataset.visua11yAgentOrgFontSize).toBe('16'); // 16px original size
  });

  it('should use stored original font size on subsequent calls', () => {
    const pElement = document.querySelector('p:not(.visua11y-agent-container p)') as HTMLElement;
    
    // First call - stores original size and applies multiplication
    adjustFontSize(1.5);
    expect(pElement.style.fontSize).toBe('24px'); // 16 * 1.5
    
    // Second call - should use original size (16), not the current size (24)
    adjustFontSize(2);
    expect(pElement.style.fontSize).toBe('32px'); // 16 * 2, not 24 * 2
  });

  it('should work with default multiplication factor of 1 (no change)', () => {
    const h1Element = document.querySelector('h1') as HTMLElement;
    const originalSize = window.getComputedStyle(h1Element).fontSize;
    
    adjustFontSize(); // Uses default value of 1
    
    const newSize = window.getComputedStyle(h1Element).fontSize;
    expect(newSize).toBe(originalSize); // Should remain unchanged
  });

  it('should handle elements with no initially computed font size', () => {
    const newElement = document.createElement('span');
    newElement.textContent = 'New element';
    document.body.appendChild(newElement);
    
    // This should not throw an error and should handle the lack of computed style gracefully
    expect(() => {
      adjustFontSize(1.5);
    }).not.toThrow();
    
    document.body.removeChild(newElement);
  });
});