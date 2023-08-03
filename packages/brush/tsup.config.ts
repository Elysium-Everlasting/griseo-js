import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    node: 'src/node.ts',
    // browser: 'src/browser.ts',
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
