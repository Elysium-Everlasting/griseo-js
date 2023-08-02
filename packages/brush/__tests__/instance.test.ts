import { describe, test, expect } from 'vitest'
import { chalk, createChalk } from '../src/index.js'

chalk.level = 1

describe('chalk instance', () => {
  test('create an isolated context where colors can be disabled (by level)', () => {
    const instance = createChalk({ level: 0 })

    expect(instance.red('foo')).toBe('foo')
    expect(chalk.red('foo')).toBe('\u001B[31mfoo\u001B[39m')

    instance.level = 2
    expect(instance.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
  })

  test('the `level` option should be a number from 0 to 3', () => {
    expect(() => {
      createChalk({ level: 10 })
    }).toThrowError(/should be an integer from 0 to 3/)

    expect(() => {
      createChalk({ level: -1 })
    }).toThrowError(/should be an integer from 0 to 3/)
  })
})
