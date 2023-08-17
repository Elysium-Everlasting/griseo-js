import ansiColors from 'ansi-colors'
import chalk from 'chalk'
import cliColor from 'cli-color'
import * as colorette from 'colorette'
import kleur from 'kleur'
import * as kleurColors from 'kleur/colors'
import * as nanocolors from 'nanocolors'
import picocolors from 'picocolors'
import { describe, bench } from 'vitest'

import { brush } from '../src/index.js'

describe('RGB simple', () => {
  bench('@griseo.js/brush', () => {
    brush.red('Red') + brush.green('green') + brush.blue('blue')
  })

  bench('ansi-colors', () => {
    ansiColors.red('Red') + ansiColors.green('green') + ansiColors.blue('blue')
  })

  bench('chalk', () => {
    chalk.red('Red') + chalk.green('green') + chalk.blue('blue')
  })

  bench('cli-color', () => {
    cliColor.red('Red') + cliColor.green('green') + cliColor.blue('blue')
  })

  bench('colorette', () => {
    colorette.red('Red') + colorette.green('green') + colorette.blue('blue')
  })

  bench('kleur', () => {
    kleur.red('Red') + kleur.green('green') + kleur.blue('blue')
  })

  bench('kleur/colors', () => {
    kleurColors.red('Red') + kleurColors.green('green') + kleurColors.blue('blue')
  })

  bench('nanocolors', () => {
    nanocolors.red('Red') + nanocolors.green('green') + nanocolors.blue('blue')
  })

  bench('picocolors', () => {
    picocolors.red('Red') + picocolors.green('green') + picocolors.blue('blue')
  })
})
