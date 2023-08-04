import ci from 'ci-info'
import { defineUserConfig, defaultTheme } from 'vuepress'
import { description, repository } from '../package.json'

const gitRepository = repository.url.split('/').pop() ?? ''

const config: ReturnType<typeof defineUserConfig> = defineUserConfig({
  base: ci.GITHUB_ACTIONS ? `/${gitRepository.replace('.git', '')}/` : undefined,

  title: 'Griseo',

  description,

  public: 'static',

  theme: defaultTheme({
    repo: repository.url,
  }),
})

export default config
