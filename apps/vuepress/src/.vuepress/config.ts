import ci from 'ci-info'
import { defineUserConfig, defaultTheme } from 'vuepress'
import { description, repository } from '../../package.json'

const gitRepository = repository.url.split('/').pop() ?? ''

export default defineUserConfig({
  base: ci.GITHUB_ACTIONS ? `/${gitRepository.replace('.git', '')}/` : undefined,

  /**
   * @see https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'VuePress Documentation',

  /**
   * @see https://v1.vuepress.vuejs.org/config/#description
   */
  description,

  /**
   * Extra tags to be injected to the page HTML `<head>` .
   *
   * @see https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * @see https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  theme: defaultTheme({
    repo: repository.url,
    editLink: false,
    editLinkText: '',
    lastUpdated: false,
    navbar: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Config',
        link: '/config/',
      },
      {
        text: 'VuePress',
        link: 'https://v1.vuepress.vuejs.org',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          collapsible: false,
          children: ['', 'using-vue'],
        },
      ],
    },
  }),

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [{ name: '@vuepress/plugin-back-to-top' }, { name: '@vuepress/plugin-medium-zoom' }],
})
