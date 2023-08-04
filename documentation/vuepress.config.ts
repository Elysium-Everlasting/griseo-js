import fs from 'node:fs'
import path from 'node:path'
import ci from 'ci-info'
import UnoCSS from 'unocss/vite'
import { defineUserConfig, defaultTheme } from 'vuepress'
import { presetWind } from 'unocss/preset-wind'
import { viteBundler } from '@vuepress/bundler-vite'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { description, repository } from '../package.json'
import { findAllProjects, getWorkspaceRoot } from './src/lib/projects.js'
import type { Library } from './src/lib/library.js'

const projects = findAllProjects(path.resolve(getWorkspaceRoot(), 'packages'))

/**
 * Libraries are just an array of package.jsons of the available packages.
 */
const __libraries__: Library[] = projects
  .filter((project) => fs.existsSync(path.resolve(project, 'package.json')))
  .map((project) => {
    try {
      const library: Library = JSON.parse(
        fs.readFileSync(path.resolve(project, 'package.json'), 'utf-8'),
      )
      return library
    } catch {
      const library = {
        name: path.basename(project),
        description: '',
      } as Library
      return library
    }
  })
  .map((library) => {
    /**
     * If the name is in the form, '@griseo-js/<package name>', remove the '@griseo-js/' part.
     */
    if (library.name.includes('/')) {
      library.name = library.name.split('/').pop() ?? ''
    }

    /**
     * href is just the lowercase name.
     */
    library.href = `/${library.name}`

    /**
     * Capitalize the first letter of the name.
     */
    library.name = library.name.charAt(0).toUpperCase() + library.name.slice(1)
    return library
  })

const gitRepository = repository.url.split('/').pop() ?? ''

const config: ReturnType<typeof defineUserConfig> = defineUserConfig({
  base: ci.GITHUB_ACTIONS ? `/${gitRepository.replace('.git', '')}/` : undefined,

  title: 'Griseo',

  description,

  public: 'static',

  define: {
    __libraries__,
  },

  alias: {
    '@theme/HomeFooter.vue': './src/layout/HomeFooter.vue',
  },

  theme: defaultTheme({
    repo: repository.url,
    sidebar: __libraries__.map((library) => {
      return {
        text: library.name,
        link: library.href,
      }
    }),
  }),

  plugins: [
    registerComponentsPlugin({
      componentsDir: './src/components',
    }),
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
