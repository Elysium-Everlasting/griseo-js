import ci from 'ci-info'
import UnoCSS from 'unocss/vite'
import { presetWind } from 'unocss/preset-wind'
import { defineUserConfig, defaultTheme } from 'vuepress'
import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash'
import { viteBundler } from '@vuepress/bundler-vite'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { description, repository } from '../package.json'
import { generateSidebar } from './src/lib/sidebar.js'
import { getLibraries } from './src/lib/library.js'

const gitRepository = repository.url.split('/').pop() ?? ''
const base = ci.GITHUB_ACTIONS ? (`/${gitRepository.replace('.git', '')}/` as const) : undefined

const config: ReturnType<typeof defineUserConfig> = defineUserConfig({
  base,

  title: 'Griseo',

  description,

  public: 'static',

  define: {
    __libraries__: getLibraries(base),
  },

  alias: {
    '@theme/HomeFooter.vue': './src/layout/HomeFooter.vue',
  },

  async extendsMarkdown(extendable) {
    const shiki = await markdownItShikiTwoslashSetup({
      theme: 'nord',
    })
    extendable.use
    shiki
  },
  theme: defaultTheme({
    repo: repository.url,
    sidebar: generateSidebar('./src/routes'),
  }),

  plugins: [
    registerComponentsPlugin({
      componentsDir: './src/components',
    }),
    backToTopPlugin(),
  ],
  bundler: viteBundler({
    viteOptions: {
      plugins: [
        UnoCSS({
          presets: [presetWind({})],
        }),
      ],
    },
  }),
})

export default config
