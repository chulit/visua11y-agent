import { ICON_SELECTOR } from '@/enum/Selectors';

const FONT_SIZE_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span,blockquote,.visua11y-agent-text';
const ICON_SELECTOR_SET = new Set(ICON_SELECTOR);

export default function adjustFontSize(multiply: number = 1) {
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
