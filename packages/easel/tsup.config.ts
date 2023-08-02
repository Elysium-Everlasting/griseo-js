import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    sgr: 'src/sgr.ts',
    ansi: 'src/ansi.ts',
    'color-support/node': 'src/color-support/node.ts',
    'color-support/browser': 'src/color-support/browser.ts',
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
