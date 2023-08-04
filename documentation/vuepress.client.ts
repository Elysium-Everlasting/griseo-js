import 'uno.css'
import './src/styles/shiki-twoslash.styl'
import { defineClientConfig } from '@vuepress/client'
import Root from './src/layout/RootLayout.vue'

export default defineClientConfig({
  layouts: {
    Root,
  },
})
