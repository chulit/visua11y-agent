import { defineConfig } from 'vitepress';
import packageJson from '../../package.json';

const BASE = '/visua11y-agent/';
const isDev = process.env.NODE_ENV === 'development';
const demoLink = isDev ? '/demo/' : 'https://chulit.github.io/visua11y-agent/demo/';

export default defineConfig({
  base: BASE,
  title: 'Visua11y Agent',
  titleTemplate: ':title | Visua11y Agent - Universal Accessibility Widget',
  description: 'Zero-dependency universal accessibility widget and toolbar for WCAG 2.1 & ADA compliance with 53 languages, screen reader, and contrast presets.',

  sitemap: {
    hostname: 'https://chulit.github.io/visua11y-agent/'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/webp', href: `${BASE}logo.webp` }],
    ['link', { rel: 'canonical', href: 'https://chulit.github.io/visua11y-agent/' }],
    ['meta', { name: 'keywords', content: 'accessibility, a11y, web accessibility widget, WCAG 2.1, ADA compliance, screen reader, dyslexia font, high contrast, accessibility toolbar, open source, userway alternative, aksesibilitas website, plugin disabilitas web, widget ramah disabilitas' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Visua11y Agent — Universal Web Accessibility Widget' }],
    ['meta', { property: 'og:description', content: 'Zero-dependency universal accessibility widget & toolbar supporting 53 languages, screen reader, dyslexia fonts, and WCAG compliance.' }],
    ['meta', { property: 'og:image', content: `https://chulit.github.io${BASE}logo.webp` }],
    ['meta', { property: 'og:url', content: 'https://chulit.github.io/visua11y-agent/' }],
    ['meta', { property: 'og:site_name', content: 'Visua11y Agent' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Visua11y Agent — Universal Accessibility Widget' }],
    ['meta', { name: 'twitter:description', content: 'Zero-dependency universal accessibility widget & toolbar supporting 53 languages, screen reader, and WCAG compliance.' }],
    ['meta', { name: 'twitter:image', content: `https://chulit.github.io${BASE}logo.webp` }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Visua11y Agent',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        description: 'Zero-dependency universal accessibility (a11y) website widget and toolbar for WCAG 2.1 & ADA compliance, high contrast, dyslexia fonts, screen reader, and voice navigation.',
        url: 'https://chulit.github.io/visua11y-agent/',
        downloadUrl: 'https://www.npmjs.com/package/visua11y-agent',
        softwareVersion: packageJson.version,
        author: {
          '@type': 'Person',
          name: 'Chulit',
          url: 'https://github.com/chulit'
        }
      })
    ]
  ],

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/chulit/visua11y-agent' }
    ]
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          { text: 'Features', link: '/guide/features' },
          { text: 'Live Demo', link: demoLink, target: '_self', rel: '' },
          {
            text: `v${packageJson.version}`,
            items: [
              {
                text: 'Changelog / Releases',
                link: 'https://github.com/chulit/visua11y-agent/releases'
              },
              {
                text: 'npm Package',
                link: 'https://www.npmjs.com/package/visua11y-agent'
              },
              {
                text: 'jsDelivr CDN',
                link: 'https://www.jsdelivr.com/package/npm/visua11y-agent'
              },
              {
                text: 'unpkg CDN',
                link: `https://unpkg.com/browse/visua11y-agent@${packageJson.version}/`
              }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/guide/' },
              { text: 'Features', link: '/guide/features' },
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
          { text: 'Fitur', link: '/id/guide/features' },
          { text: 'Demo Langsung', link: demoLink, target: '_self', rel: '' },
          {
            text: `v${packageJson.version}`,
            items: [
              {
                text: 'Catatan Rilis / Changelog',
                link: 'https://github.com/chulit/visua11y-agent/releases'
              },
              {
                text: 'Paket npm',
                link: 'https://www.npmjs.com/package/visua11y-agent'
              },
              {
                text: 'CDN jsDelivr',
                link: 'https://www.jsdelivr.com/package/npm/visua11y-agent'
              },
              {
                text: 'CDN unpkg',
                link: `https://unpkg.com/browse/visua11y-agent@${packageJson.version}/`
              }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Panduan',
            items: [
              { text: 'Pengenalan', link: '/id/guide/' },
              { text: 'Fitur', link: '/id/guide/features' },
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
