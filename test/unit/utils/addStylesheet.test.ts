import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import addStylesheet from '../../../src/utils/addStylesheet';

describe('addStylesheet', () => {
  beforeEach(() => {
    // Clean up any existing test styles
    const existingStyles = document.head.querySelectorAll('style');
    existingStyles.forEach(style => style.remove());
  });

  afterEach(() => {
    // Clean up test styles after each test
    const testStyles = document.head.querySelectorAll('style');
    testStyles.forEach(style => style.remove());
  });

  it('should create a new style element and add it to the head when called with id and css', () => {
    const testId = 'test-style-id';
    const testCss = 'body { color: red; }';

    addStylesheet({ id: testId, css: testCss });

    const styleElement = document.getElementById(testId);
    expect(styleElement).not.toBeNull();
    expect(styleElement!.innerHTML).toBe(testCss);
    expect(document.head.contains(styleElement!)).toBe(true);
  });

  it('should update an existing style element if it already exists with the same id', () => {
    const testId = 'existing-style';
    const initialCss = 'body { color: blue; }';
    const updatedCss = 'body { color: green; }';

    // First, add the initial style
    addStylesheet({ id: testId, css: initialCss });

    // Verify initial state
    let styleElement = document.getElementById(testId);
    expect(styleElement).not.toBeNull();
    expect(styleElement!.innerHTML).toBe(initialCss);

    // Update with new CSS
    addStylesheet({ id: testId, css: updatedCss });

    // Verify updated state
    styleElement = document.getElementById(testId);
    expect(styleElement).not.toBeNull();
    expect(styleElement!.innerHTML).toBe(updatedCss);
  });

  it('should not create a style element if css is empty', () => {
    const testId = 'empty-css-test';
    const initialStyleCount = document.head.querySelectorAll('style').length;

    addStylesheet({ id: testId, css: '' });

    const finalStyleCount = document.head.querySelectorAll('style').length;
    expect(finalStyleCount).toBe(initialStyleCount);
    expect(document.getElementById(testId)).toBeNull();
  });

  it('should not create a style element if css is null', () => {
    const testId = 'null-css-test';
    const initialStyleCount = document.head.querySelectorAll('style').length;

    // @ts-ignore - Testing null input
    addStylesheet({ id: testId, css: null });

    const finalStyleCount = document.head.querySelectorAll('style').length;
    expect(finalStyleCount).toBe(initialStyleCount);
    expect(document.getElementById(testId)).toBeNull();
  });

  it('should not create a style element if css is undefined', () => {
    const testId = 'undefined-css-test';
    const initialStyleCount = document.head.querySelectorAll('style').length;

    // @ts-ignore - Testing undefined input
    addStylesheet({ id: testId, css: undefined });

    const finalStyleCount = document.head.querySelectorAll('style').length;
    expect(finalStyleCount).toBe(initialStyleCount);
    expect(document.getElementById(testId)).toBeNull();
  });

  it('should assign the id to the style element if the element was created without an id', () => {
    // In our implementation, we always assign the id if provided
    const testId = 'assigned-id-test';
    const testCss = 'p { margin: 0; }';

    addStylesheet({ id: testId, css: testCss });

    const styleElement = document.getElementById(testId);
    expect(styleElement).not.toBeNull();
    expect(styleElement!.id).toBe(testId);
  });

  it('should properly handle CSS with special characters', () => {
    const testId = 'special-css-test';
    const testCss = 'body::before { content: "⚠️"; font-family: "Arial"; }';

    addStylesheet({ id: testId, css: testCss });

    const styleElement = document.getElementById(testId);
    expect(styleElement).not.toBeNull();
    expect(styleElement!.innerHTML).toBe(testCss);
  });
});