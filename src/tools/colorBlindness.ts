export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export const COLOR_BLINDNESS_TYPES: ColorBlindnessType[] = [
  'protanopia',
  'deuteranopia',
  'tritanopia',
  'achromatopsia',
];

const SVG_CONTAINER_ID = 'visua11y-color-blindness-svg';
const STYLE_TAG_ID = 'visua11y-color-blindness-style';

const MATRICES: Record<ColorBlindnessType, string> = {
  protanopia: '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
  deuteranopia: '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0',
  tritanopia: '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0',
  achromatopsia: '0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0',
};

function ensureSvgFilters(): void {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }

  if (document.getElementById(SVG_CONTAINER_ID)) {
    return;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = SVG_CONTAINER_ID;
  svg.setAttribute('style', 'position: absolute; width: 0; height: 0; pointer-events: none; overflow: hidden;');
  svg.setAttribute('aria-hidden', 'true');

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  COLOR_BLINDNESS_TYPES.forEach((type) => {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.id = `visua11y-filter-${type}`;

    const feColorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    feColorMatrix.setAttribute('type', 'matrix');
    feColorMatrix.setAttribute('values', MATRICES[type]);

    filter.appendChild(feColorMatrix);
    defs.appendChild(filter);
  });

  svg.appendChild(defs);
  const mountTarget = document.documentElement || document.body;
  mountTarget.appendChild(svg);
}

function ensureStyleSheet(): void {
  if (typeof document === 'undefined' || !document.head) {
    return;
  }

  if (document.getElementById(STYLE_TAG_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_TAG_ID;
  style.textContent = `
    html[data-visua11y-color-blindness="protanopia"] body {
      filter: url('#visua11y-filter-protanopia') !important;
    }
    html[data-visua11y-color-blindness="deuteranopia"] body {
      filter: url('#visua11y-filter-deuteranopia') !important;
    }
    html[data-visua11y-color-blindness="tritanopia"] body {
      filter: url('#visua11y-filter-tritanopia') !important;
    }
    html[data-visua11y-color-blindness="achromatopsia"] body {
      filter: url('#visua11y-filter-achromatopsia') !important;
    }
    .visua11y-agent-container,
    .visua11y-agent-widget,
    .visua11y-agent-menu {
      filter: none !important;
    }
  `;
  document.head.appendChild(style);
}

export function applyColorBlindness(type: ColorBlindnessType | string): void {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }

  const normalized = String(type).toLowerCase() as ColorBlindnessType;
  if (!COLOR_BLINDNESS_TYPES.includes(normalized)) {
    removeColorBlindness();
    return;
  }

  ensureSvgFilters();
  ensureStyleSheet();
  document.documentElement.setAttribute('data-visua11y-color-blindness', normalized);
}

export function removeColorBlindness(): void {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }

  document.documentElement.removeAttribute('data-visua11y-color-blindness');

  const svg = document.getElementById(SVG_CONTAINER_ID);
  if (svg) {
    svg.remove();
  }

  const style = document.getElementById(STYLE_TAG_ID);
  if (style) {
    style.remove();
  }
}
