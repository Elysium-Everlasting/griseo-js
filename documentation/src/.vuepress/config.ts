import ci from 'ci-info'
import { defineUserConfig, defaultTheme } from 'vuepress'
import { description, repository } from '../../package.json'

const gitRepository = repository.url.split('/').pop() ?? ''

export default defineUserConfig({
  base: ci.GITHUB_ACTIONS ? `/${gitRepository.replace('.git', '')}/` : undefined,

  title: 'Griseo',

  description,

  theme: defaultTheme({
    repo: repository.url,
  }),
})
