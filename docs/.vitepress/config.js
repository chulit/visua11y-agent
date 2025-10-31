export default {
  base: '/visua11y-agent/',
  title: 'Visua11y Agent',
  description: 'Accessibility Widget for Websites',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Live Demo', link: '/demo/' }
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
}
