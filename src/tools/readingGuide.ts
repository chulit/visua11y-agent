import template from './readingGuide.html';
import css from './readingGuide.css';

export default function readingGuide(enable = false) {
  let guide = document.querySelector('.visua11y-agent-rg-container');

  if (enable) {
    if (!guide) {
      guide = document.createElement('div');
      guide.classList.add('visua11y-agent-rg-container');
      guide.innerHTML = `<style>${css}</style>${template}`;

      const rgTop: HTMLElement = guide.querySelector('.visua11y-agent-rg-top');
      const rgBottom: HTMLElement = guide.querySelector('.visua11y-agent-rg-bottom');
      const margin = 20;

      window.__visua11yAgent__onScrollReadableGuide = (event: MouseEvent) => {
        rgTop.style.height = `${event.clientY - margin}px`;
        rgBottom.style.height = `${window.innerHeight - event.clientY - margin * 2}px`;
      };

      document.addEventListener('mousemove', window.__visua11yAgent__onScrollReadableGuide, {
        passive: false,
      });

      document.body.appendChild(guide);
    }
  } else {
    guide?.remove();

    if (window.__visua11yAgent__onScrollReadableGuide) {
      document.removeEventListener('mousemove', window.__visua11yAgent__onScrollReadableGuide);
      delete window.__visua11yAgent__onScrollReadableGuide;
    }
  }
}
