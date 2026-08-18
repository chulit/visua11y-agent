import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupFocusTrap } from '../../../src/utils/focusTrap';

describe('focusTrap', () => {
  let container: HTMLElement;
  let triggerBtn: HTMLButtonElement;
  let btn1: HTMLButtonElement;
  let btn2: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    triggerBtn = document.createElement('button');
    triggerBtn.id = 'triggerBtn';
    btn1 = document.createElement('button');
    btn2 = document.createElement('button');
    btn1.id = 'btn1';
    btn2.id = 'btn2';
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(triggerBtn);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should call onClose and restore focus to trigger button when Escape key is pressed', () => {
    const onClose = vi.fn();
    const trap = setupFocusTrap(container, { onClose, triggerButton: triggerBtn });
    trap.enable();

    btn1.focus();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(event);

    expect(onClose).toHaveBeenCalled();
    expect(document.activeElement).toBe(triggerBtn);
    trap.disable();
  });

  it('should wrap focus on Tab and Shift+Tab keypresses', () => {
    const trap = setupFocusTrap(container, { triggerButton: triggerBtn });
    trap.enable();

    // Focus first element
    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    // Shift+Tab from first element should focus last element
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(shiftTabEvent);
    expect(document.activeElement).toBe(btn2);

    // Tab from last element should focus first element
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: false,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(tabEvent);
    expect(document.activeElement).toBe(btn1);

    trap.disable();
  });

  it('should not throw if container has no focusable elements', () => {
    const emptyContainer = document.createElement('div');
    document.body.appendChild(emptyContainer);

    const trap = setupFocusTrap(emptyContainer);
    expect(() => trap.enable()).not.toThrow();

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    expect(() => document.dispatchEvent(tabEvent)).not.toThrow();

    trap.disable();
  });
});
