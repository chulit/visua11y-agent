import { ICON_SELECTOR } from '@/enum/Selectors';

// Include common text containers so real-world layouts (div/button-heavy) are resized too.
const FONT_SIZE_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span,blockquote,div,button,.visua11y-agent-text';
const ICON_SELECTOR_SET = new Set(ICON_SELECTOR);

export default function adjustFontSize(multiply: number = 1) {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }

  // 1. Instant root CSS custom property scaling
  document.documentElement.style.setProperty('--visua11y-font-scale', String(multiply));

  // 2. Hybrid fallback: traverse and resize elements with computed styles
  document.querySelectorAll(FONT_SIZE_SELECTOR).forEach((el: HTMLElement) => {
    if (el.closest('.visua11y-agent-container')) {
      return;
    }
    // Skip elements that contain any class in ICON_SELECTOR_SET
    for (const cls of Array.from(el.classList)) {
      if (ICON_SELECTOR_SET.has(cls)) {
        return;
      }
    }

    // Get the original font size
    const orgFontSize =
      Number(el.dataset.visua11yAgentOrgFontSize) || parseInt(window.getComputedStyle(el).fontSize);

    // If no font size stored in data, set it now
    if (!el.dataset.visua11yAgentOrgFontSize) {
      el.dataset.visua11yAgentOrgFontSize = String(orgFontSize);
    }

    // Calculate and apply new font size
    const newFontSize = orgFontSize * multiply;
    el.style.fontSize = `${newFontSize}px`;
  });
}
