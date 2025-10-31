import { vi } from 'vitest';

// Mock HTML and CSS imports globally
vi.mock('../src/components/widget/widget.html', () => ({
  default: '<div class="visua11y-agent-container">Test Widget HTML</div>',
}));

vi.mock('../src/components/widget/widget.css', () => ({
  default: '/* test CSS */',
}));

vi.mock('../src/components/widget/widget.html', () => ({
  default: '<div class="visua11y-agent-container">Test Widget HTML</div>',
}));

vi.mock('../src/components/menu/menu.html', () => ({
  default: '<div class="visua11y-agent-menu">Test Menu HTML</div>',
}));

vi.mock('../src/components/menu/menu.css', () => ({
  default: '/* menu CSS */',
}));