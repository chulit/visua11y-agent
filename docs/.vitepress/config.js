import { defineConfig } from 'vitepress';

const BASE = '/visua11y-agent/';
const isDev = process.env.NODE_ENV === 'development';
const demoLink = isDev ? '/demo/' : 'https://chulit.github.io/visua11y-agent/demo/';

export default defineConfig({
  base: BASE,
  title: 'Visua11y Agent',
  titleTemplate: ':title | Visua11y Agent - Universal Accessibility Widget',
  description: 'Zero-dependency universal accessibility widget and toolbar for WCAG 2.1 & ADA compliance with 53 languages, screen reader, and contrast presets.',

  sitemap: {
    hostname: 'https://chulit.github.io/visua11y-agent'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE}logo.png` }],
    ['meta', { name: 'keywords', content: 'accessibility, a11y, web accessibility widget, WCAG 2.1, ADA compliance, screen reader, dyslexia font, high contrast, accessibility toolbar, open source' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Visua11y Agent — Universal Web Accessibility Widget' }],
    ['meta', { property: 'og:description', content: 'Zero-dependency universal accessibility widget & toolbar supporting 53 languages, screen reader, dyslexia fonts, and WCAG compliance.' }],
    ['meta', { property: 'og:image', content: `https://chulit.github.io${BASE}logo.png` }],
    ['meta', { property: 'og:url', content: 'https://chulit.github.io/visua11y-agent/' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'Visua11y Agent — Universal Accessibility Widget' }],
    ['meta', { name: 'twitter:description', content: 'Zero-dependency universal accessibility widget & toolbar supporting 53 languages, screen reader, and WCAG compliance.' }],
    ['meta', { name: 'twitter:image', content: `https://chulit.github.io${BASE}logo.png` }]
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
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
              { text: 'Configuration', link: '/guide/configuration' },
              { text: 'Universal Usage', link: '/guide/universal-usage' }
            ]
          }
        ]
      }
    },
    id: {
      label: 'Bahasa Indonesia',
      lang: 'id',
      link: '/id/',
      themeConfig: {
        nav: [
          { text: 'Beranda', link: '/id/' },
          { text: 'Panduan', link: '/id/guide/' },
          { text: 'Demo Langsung', link: demoLink, target: '_self', rel: '' }
        ],
        sidebar: [
          {
            text: 'Panduan',
            items: [
              { text: 'Pengenalan', link: '/id/guide/' },
              { text: 'Instalasi', link: '/id/guide/installation' },
              { text: 'Konfigurasi', link: '/id/guide/configuration' },
              { text: 'Penggunaan Universal', link: '/id/guide/universal-usage' }
            ]
          }
        ]
      }
    }
  }
});
