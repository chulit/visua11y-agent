import { t } from '../../i18n/translate';
import { $widget } from '@/components/widget/widget';
import { $menu } from '@/components/menu/menu';

function getTranslatedLabel(el: Element, defaultValue: string): string {
  const key = el.getAttribute('data-translate') || defaultValue;

  if (!el.hasAttribute('data-translate') && defaultValue) {
    el.setAttribute('data-translate', key);
  }

  return t(key);
}

export default function translateWidget(): void {
  const containers: HTMLElement[] = [];

  if ($widget) {
    containers.push($widget);
  }
  if ($menu) {
    containers.push($menu);
  }

  if (typeof document !== 'undefined') {
    const domContainers = document.querySelectorAll<HTMLElement>(
      '.visua11y-agent-container, .visua11y-agent-menu'
    );
    domContainers.forEach((container) => {
      if (!containers.includes(container)) {
        containers.push(container);
      }
    });
  }

  if (containers.length === 0) {
    return;
  }

  containers.forEach((container) => {
    // Translate text nodes without touching icon wrappers
    container
      .querySelectorAll('.visua11y-agent-translate, [data-translate], .visua11y-agent-card-title')
      .forEach((el) => {
        if (
          el.querySelector('svg, img') ||
          (el.children.length > 0 && !el.classList.contains('visua11y-agent-translate'))
        ) {
          return;
        }

        const key = el.getAttribute('data-translate') || el.textContent?.trim() || '';
        if (key) {
          el.textContent = getTranslatedLabel(el, key);
        }
      });

    // Translate title tooltips
    container.querySelectorAll<HTMLElement>('[title]').forEach((el) => {
      if (el.classList.contains('visua11y-agent-menu-language')) {
        return;
      }
      const originalTitle =
        el.getAttribute('data-translate-title') || el.getAttribute('title') || '';
      if (originalTitle) {
        if (!el.hasAttribute('data-translate-title')) {
          el.setAttribute('data-translate-title', originalTitle);
        }
        el.setAttribute('title', t(originalTitle));
      }
    });
  });
}
