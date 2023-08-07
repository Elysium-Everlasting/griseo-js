import { describe, bench } from 'vitest'
import chalk from 'chalk'
import kleur from 'kleur'
import { brush } from '../src/index.js'

describe('chaining', () => {
  bench('@griseo.js/brush', () => {
    brush.red.green.blue.bgRed.bgGreen.bgBlue('Hello')
  })

  bench('chalk', () => {
    chalk.red.green.blue.bgRed.bgGreen.bgBlue('Hello')
  })

  bench('kleur', () => {
    kleur.red().green().blue().bgRed().bgGreen().bgBlue('Hello')
  })
})
