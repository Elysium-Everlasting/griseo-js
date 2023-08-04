import 'uno.css'
import { defineClientConfig } from '@vuepress/client'
import Root from './src/layout/RootLayout.vue'

export default defineClientConfig({
  layouts: {
    Root,
  },
})
