import { defineConfig } from 'vitepress';

const BASE = '/visua11y-agent/';
const isDev = process.env.NODE_ENV === 'development';
const demoLink = isDev ? '/demo/' : 'https://chulit.github.io/visua11y-agent/demo/';

export default defineConfig({
  base: BASE,
  title: 'Visua11y Agent',
  description: 'Accessibility Widget for Websites',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Live Demo', link: demoLink, target: '_self', rel: '' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Configuration', link: '/guide/configuration' }
        ]
      }
    ]
  }
});
