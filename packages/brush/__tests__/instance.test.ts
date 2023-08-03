import { describe, test, expect } from 'vitest'
import { brush, createBrush } from '../src/index.js'

brush.level = 1

describe('chalk instance', () => {
  test('create an isolated context where colors can be disabled (by level)', () => {
    const instance = createBrush({ level: 0 })

    expect(instance.red('foo')).toBe('foo')
    expect(brush.red('foo')).toBe('\u001B[31mfoo\u001B[39m')

    instance.level = 2
    expect(instance.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
  })

  // Why do you need to test this if there's TypeScript?
  //
  // test('the `level` option should be a number from 0 to 3', () => {
  //   expect(() => {
  //     createBrush({ level: 10 })
  //   }).toThrowError(/should be an integer from 0 to 3/)

  //   expect(() => {
  //     createBrush({ level: -1 })
  //   }).toThrowError(/should be an integer from 0 to 3/)
  // })
})
