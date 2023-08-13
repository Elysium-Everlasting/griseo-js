import { describe, bench } from 'vitest'
import ansiColors from 'ansi-colors'
import chalk from 'chalk'
import cliColor from 'cli-color'
import * as colorette from 'colorette'
import kleur from 'kleur'
import * as kleurColors from 'kleur/colors'
import * as nanocolors from 'nanocolors'
import picocolors from 'picocolors'
import { brush } from '../src/index.js'

describe('complex', () => {
  bench('@griseo.js/brush', () => {
    brush.red(
      `a red ${brush.white('red')} red ${brush.red('red')} red ${brush.gray('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.blue('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')}red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.red('red')}red ${brush.green('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.magenta('red')} red ${brush.red('red')}red ${brush.red(
        'red',
      )} red ${brush.cyan('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.yellow('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red('red')} red ${brush.red(
        'red',
      )} message`,
    )
  })

  bench('ansi-colors', () => {
    ansiColors.red(
      `a red ${ansiColors.white('red')} red ${ansiColors.red('red')} red ${ansiColors.gray(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.blue(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')}red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')}red ${ansiColors.green(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.magenta('red')} red ${ansiColors.red(
        'red',
      )}red ${ansiColors.red('red')} red ${ansiColors.cyan('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.yellow('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} red ${ansiColors.red('red')} red ${ansiColors.red('red')} red ${ansiColors.red(
        'red',
      )} message`,
    )
  })

  bench('chalk', () => {
    chalk.red(
      `a red ${chalk.white('red')} red ${chalk.red('red')} red ${chalk.gray('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.blue('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')}red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.red('red')}red ${chalk.green('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.magenta('red')} red ${chalk.red('red')}red ${chalk.red(
        'red',
      )} red ${chalk.cyan('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.yellow('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red('red')} red ${chalk.red(
        'red',
      )} message`,
    )
  })

  bench('cli-color', () => {
    cliColor.red(
      `a red ${cliColor.white('red')} red ${cliColor.red('red')} red ${cliColor.black(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.blue(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')}red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')}red ${cliColor.green(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.magenta('red')} red ${cliColor.red(
        'red',
      )}red ${cliColor.red('red')} red ${cliColor.cyan('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.yellow('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red(
        'red',
      )} red ${cliColor.red('red')} red ${cliColor.red('red')} red ${cliColor.red('red')} message`,
    )
  })

  bench('colorette', () => {
    colorette.red(
      `a red ${colorette.white('red')} red ${colorette.red('red')} red ${colorette.gray(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.blue(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')}red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')}red ${colorette.green(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.magenta('red')} red ${colorette.red(
        'red',
      )}red ${colorette.red('red')} red ${colorette.cyan('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.yellow('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} red ${colorette.red('red')} red ${colorette.red('red')} red ${colorette.red(
        'red',
      )} message`,
    )
  })

  bench('kleur', () => {
    kleur.red(
      `a red ${kleur.white('red')} red ${kleur.red('red')} red ${kleur.gray('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.blue('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')}red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.red('red')}red ${kleur.green('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.magenta('red')} red ${kleur.red('red')}red ${kleur.red(
        'red',
      )} red ${kleur.cyan('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.yellow('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red('red')} red ${kleur.red(
        'red',
      )} message`,
    )
  })

  bench('kleur/colors', () => {
    kleurColors.red(
      `a red ${kleurColors.white('red')} red ${kleurColors.red('red')} red ${kleurColors.gray(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.blue(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')}red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')}red ${kleurColors.green(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.magenta('red')} red ${kleurColors.red(
        'red',
      )}red ${kleurColors.red('red')} red ${kleurColors.cyan('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.yellow('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} red ${kleurColors.red('red')} red ${kleurColors.red('red')} red ${kleurColors.red(
        'red',
      )} message`,
    )
  })

  bench('nanocolors', () => {
    nanocolors.red(
      `a red ${nanocolors.white('red')} red ${nanocolors.red('red')} red ${nanocolors.gray(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.blue(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')}red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')}red ${nanocolors.green(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.magenta('red')} red ${nanocolors.red(
        'red',
      )}red ${nanocolors.red('red')} red ${nanocolors.cyan('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.yellow('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} red ${nanocolors.red('red')} red ${nanocolors.red('red')} red ${nanocolors.red(
        'red',
      )} message`,
    )
  })

  bench('picocolors', () => {
    picocolors.red(
      `a red ${picocolors.white('red')} red ${picocolors.red('red')} red ${picocolors.gray(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.blue(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')}red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')}red ${picocolors.green(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.magenta('red')} red ${picocolors.red(
        'red',
      )}red ${picocolors.red('red')} red ${picocolors.cyan('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.yellow('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} red ${picocolors.red('red')} red ${picocolors.red('red')} red ${picocolors.red(
        'red',
      )} message`,
    )
  })
})
