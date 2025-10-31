import template from './widget.html';
import css from './widget.css';
import { openMenu } from '../menu/menu';
import translateWidget from '../menu/translateWidget';

import { pluginConfig } from '@/config/pluginConfig';

export let $widget: HTMLElement;
export let $widgetButton: HTMLElement | null = null;
let defaultIconHTML = '';
const DEFAULT_BUTTON_SIZE = 58;

export function applyButtonPosition() {
  if (!$widgetButton && $widget) {
    $widgetButton = $widget.querySelector<HTMLElement>('.visua11y-agent-menu-btn');
  }

  if ($widgetButton) {
    $widgetButton.style.top = 'auto';
    $widgetButton.style.bottom = 'auto';
    $widgetButton.style.left = 'auto';
    $widgetButton.style.right = 'auto';
    Object.assign($widgetButton.style, getButtonStyle());

    const size = Number(pluginConfig.size) || DEFAULT_BUTTON_SIZE;
    const iconSize = Math.max(Math.round(size * 0.62), 20);
    $widgetButton.style.setProperty('--visua11y-agent-button-size', `${size}px`);
    $widgetButton.style.setProperty('--visua11y-agent-icon-size', `${iconSize}px`);
    $widgetButton.style.width = `${size}px`;
    $widgetButton.style.height = `${size}px`;
  }
}

export function applyButtonIcon() {
  if (!$widget) {
    return;
  }

  const iconContainer = $widget.querySelector<HTMLElement>('.visua11y-agent-menu-icon');
  if (!iconContainer) {
    return;
  }

  let iconValue = (pluginConfig.icon || '').trim();

  if (iconValue.startsWith('#')) {
    const template = document.querySelector<HTMLElement>(iconValue);
    if (template) {
      if (template instanceof HTMLTemplateElement) {
        iconValue = template.innerHTML.trim();
      } else {
        iconValue = template.innerHTML?.trim() || template.textContent?.trim() || '';
      }
    } else {
      iconValue = '';
    }
  }

  if (iconValue) {
    if (iconValue.startsWith('<')) {
      iconContainer.innerHTML = iconValue;
    } else {
      iconContainer.innerHTML = '';
      const img = document.createElement('img');
      img.src = iconValue;
      img.alt = '';
      img.setAttribute('role', 'presentation');
      img.setAttribute('aria-hidden', 'true');
      iconContainer.appendChild(img);
    }
  } else if (defaultIconHTML) {
    iconContainer.innerHTML = defaultIconHTML;
  }
}

export function renderWidget() {
  $widget = document.createElement('div');
  $widget.classList.add('visua11y-agent-container');
  $widget.innerHTML = `<style>${css}</style>${template}`;

  const $btn: HTMLElement = $widget.querySelector('.visua11y-agent-menu-btn');
  $widgetButton = $btn;
  const $icon = $widget.querySelector<HTMLElement>('.visua11y-agent-menu-icon');
  defaultIconHTML = $icon?.innerHTML || defaultIconHTML;
  applyButtonPosition();
  applyButtonIcon();

  $btn?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    openMenu();
  });

  translateWidget();

  document.body.appendChild($widget);

  return $widget;
}

function getButtonStyle() {
  const { position = 'bottom-left', offset = [20, 20] } = pluginConfig;

  const [offsetX = 20, offsetY = 25] = offset;

  const centerY = `calc(50% - 27.5px - ${offsetY}px)`; // 55px / 2 = 27.5
  const centerX = `calc(50% - 27.5px - ${offsetX}px)`;

  switch (position) {
    case 'bottom-right':
      return {
        bottom: `${offsetY}px`,
        right: `${offsetX}px`,
        left: 'auto',
      };
    case 'top-left':
      return {
        top: `${offsetY}px`,
        left: `${offsetX}px`,
        bottom: 'auto',
      };
    case 'top-right':
      return {
        top: `${offsetY}px`,
        right: `${offsetX}px`,
        left: 'auto',
        bottom: 'auto',
      };
    case 'center-left':
      return {
        left: `${offsetX}px`,
        bottom: centerY,
      };
    case 'center-right':
      return {
        right: `${offsetX}px`,
        left: 'auto',
        bottom: centerY,
      };
    case 'bottom-center':
      return {
        bottom: `${offsetY}px`,
        left: centerX,
      };
    case 'top-center':
      return {
        top: `${offsetY}px`,
        bottom: 'auto',
        left: centerX,
      };
    default: // "bottom-left"
      return {
        bottom: `${offsetY}px`,
        left: `${offsetX}px`,
      };
  }
}
