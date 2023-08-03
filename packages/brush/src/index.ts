export * from './node.js'

import { chalk } from './chalk.js'

console.log(
  chalk
    .green()
    .bgBlack()
    .bold()
    .italic()
    .underline()
    .overline(`foo ${chalk.red.dim('bar')} ${chalk.reset('baz')}`),
)
console.log(
  chalk.green.bgBlack.bold.italic.underline.overline(
    `foo ${chalk.red.dim('bar')} ${chalk.reset('baz')}`,
  ),
)
console.log(
  chalk
    .green()
    .bgBlack.bold()
    .italic.underline()
    .overline(`foo ${chalk.red.dim('bar')} ${chalk.reset('baz')}`),
)
console.log(chalk.bgHex('#BF3636').hex('#F2D399')('foo bar baz'))
console.log(chalk.rgb(44, 0, 163).bgRgb(204, 0, 92)('foo bar baz'))
console.log(chalk.ansi256(69).bgAnsi256(194)('Honeydew, more or less'))
