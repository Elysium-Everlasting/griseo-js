import { describe, test, expect } from 'vitest'
import { brush, createBrush } from '../src/index.js'

brush.level = 1

describe('visible', () => {
  test('visible: normal output when level > 0', () => {
    const instance = createBrush({ level: 3 })
    expect(instance.visible.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(instance.red.visible('foo')).toBe('\u001B[31mfoo\u001B[39m')
  })

  test('visible: no output when level is too low', () => {
    const instance = createBrush({ level: 0 })
    expect(instance.visible.red('foo')).toBe('')
    expect(instance.red.visible('foo')).toBe('')
  })

  test('test switching back and forth between level == 0 and level > 0', () => {
    const instance = createBrush({ level: 3 })

    expect(instance.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(instance.visible.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(instance.red.visible('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(instance.visible('foo')).toBe('foo')
    expect(instance.red('foo')).toBe('\u001B[31mfoo\u001B[39m')

    instance.level = 0

    expect(instance.red('foo')).toBe('foo')
    expect(instance.visible('foo')).toBe('')
    expect(instance.visible.red('foo')).toBe('')
    expect(instance.red.visible('foo')).toBe('')
    expect(instance.red('foo')).toBe('foo')

    instance.level = 3

    expect(instance.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(instance.visible.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(instance.red.visible('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(instance.visible('foo')).toBe('foo')
    expect(instance.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
  })
})
