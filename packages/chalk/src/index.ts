export * from './lib/sgr.js'
export * from './lib/ansi.js'
export * from './chalk.js'

import { createChalk } from './chalk.js'

const chalk = createChalk({ level: 3 })

console.log(
  chalk.rgb(169, 42, 69).bgRgb(69, 42, 169).italic.bold.underline.overline('HELLO, WORLD!'),
)
