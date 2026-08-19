import renderMenu from './renderMenu';
import toggleMenu from './toggleMenu';
import translateWidget from './translateWidget';
import { setupFocusTrap } from '@/utils/focusTrap';
import { $widgetButton } from '../widget/widget';

export let $menu: HTMLElement | undefined;
let focusTrapInstance: { enable: () => void; disable: () => void } | null = null;

export function openMenu() {
  if ($menu && document.body.contains($menu)) {
    toggleMenu(true);
  } else {
    $menu = renderMenu();
  }

  translateWidget();

  if ($widgetButton) {
    $widgetButton.setAttribute('aria-expanded', 'true');
  }

  if ($menu) {
    focusTrapInstance?.disable();
    focusTrapInstance = setupFocusTrap($menu, {
      onClose: () => closeMenu(),
      triggerButton: $widgetButton,
    });
    focusTrapInstance.enable();
  }
}

export function closeMenu() {
  if ($menu) {
    toggleMenu(false);
  }
  focusTrapInstance?.disable();
  if ($widgetButton) {
    $widgetButton.setAttribute('aria-expanded', 'false');
  }
}
