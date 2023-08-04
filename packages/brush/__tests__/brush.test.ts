import process from 'node:process'
import { describe, test, expect } from 'vitest'
import { brush, brushStderr, createBrush } from '../src/index.js'

brush.level = 3
brushStderr.level = 3

console.log('TERM:', process.env['TERM'] || '[none]')
console.log('platform:', process.platform || '[unknown]')

describe('chalk', () => {
  test("don't add any styling when called as the base function", () => {
    brush('')
    expect(brush('foo')).toBe('foo')
  })

  test('support multiple arguments in base function', () => {
    expect(brush('hello', 'there')).toBe('hello there')
  })

  test('support automatic casting to string', () => {
    expect(brush(['hello', 'there'])).toBe('hello,there')
    expect(brush(123)).toBe('123')

    expect(brush.bold(['foo', 'bar'])).toBe('\u001B[1mfoo,bar\u001B[22m')
    expect(brush.green(98_765)).toBe('\u001B[32m98765\u001B[39m')
  })

  test('style string', () => {
    expect(brush.underline('foo')).toBe('\u001B[4mfoo\u001B[24m')
    expect(brush.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(brush.bgRed('foo')).toBe('\u001B[41mfoo\u001B[49m')
  })

  test('support applying multiple styles at once', () => {
    expect(brush.red.bgGreen.underline('foo')).toBe(
      '\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39m',
    )

    expect(brush.underline.red.bgGreen('foo')).toBe(
      '\u001B[4m\u001B[31m\u001B[42mfoo\u001B[49m\u001B[39m\u001B[24m',
    )
  })

  test('support nesting styles', () => {
    expect(brush.red('foo' + brush.underline.bgBlue('bar') + '!')).toBe(
      '\u001B[31mfoo\u001B[4m\u001B[44mbar\u001B[49m\u001B[24m!\u001B[39m',
    )
  })

  test('support nesting styles of the same type (color, underline, bg)', () => {
    expect(brush.red('a' + brush.yellow('b' + brush.green('c') + 'b') + 'c')).toBe(
      '\u001B[31ma\u001B[33mb\u001B[32mc\u001B[39m\u001B[31m\u001B[33mb\u001B[39m\u001B[31mc\u001B[39m',
    )
  })

  test('reset all styles with `.reset()`', () => {
    expect(brush.reset(brush.red.bgGreen.underline('foo') + 'foo')).toBe(
      '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m',
    )
  })

  test('support caching multiple styles', () => {
    const { red, green } = brush.red
    const redBold = red.bold
    const greenBold = green.bold

    expect(red('foo')).not.toBe(green('foo'))
    expect(redBold('bar')).not.toBe(greenBold('bar'))
    expect(green('baz')).not.toBe(greenBold('baz'))
  })

  test('alias gray to grey', () => {
    expect(brush.grey('foo')).toBe('\u001B[90mfoo\u001B[39m')
  })

  test('support variable number of arguments', () => {
    expect(brush.red('foo', 'bar')).toBe('\u001B[31mfoo bar\u001B[39m')
  })

  test('support falsy values', () => {
    expect(brush.red(0)).toBe('\u001B[31m0\u001B[39m')
  })

  test("don't output escape codes if the input is empty", () => {
    expect(brush.red('')).toBe('')
    expect(brush.red.blue.black('')).toBe('')
  })

  test('keep Function.prototype methods', () => {
    expect(Reflect.apply(brush.grey, null, ['foo'])).toBe('\u001B[90mfoo\u001B[39m')
    expect(brush.reset(brush.red.bgGreen.underline.bind(null)('foo') + 'foo')).toBe(
      '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m',
    )
    // expect(chalk.red.blue.black.call('')).toBe('')
  })

  test('line breaks should open and close colors', () => {
    expect(brush.grey('hello\nworld')).toBe('\u001B[90mhello\u001B[39m\n\u001B[90mworld\u001B[39m')
  })

  test('line breaks should open and close colors with CRLF', () => {
    expect(brush.grey('hello\r\nworld')).toBe(
      '\u001B[90mhello\u001B[39m\r\n\u001B[90mworld\u001B[39m',
    )
  })

  test('properly convert RGB to 16 colors on basic color terminals', () => {
    const chalk = createBrush({ level: 1 })
    expect(chalk.hex('#FF0000')('hello')).toBe('\u001B[91mhello\u001B[39m')
    expect(chalk.bgHex('#FF0000')('hello')).toBe('\u001B[101mhello\u001B[49m')
  })

  test('properly convert RGB to 256 colors on basic color terminals', () => {
    const chalk2 = createBrush({ level: 2 })
    expect(chalk2.hex('#FF0000')('hello')).toBe('\u001B[38;5;196mhello\u001B[39m')
    expect(chalk2.bgHex('#FF0000')('hello')).toBe('\u001B[48;5;196mhello\u001B[49m')

    const chalk3 = createBrush({ level: 3 })
    expect(chalk3.bgHex('#FF0000')('hello')).toBe('\u001B[48;2;255;0;0mhello\u001B[49m')
  })

  test("don't emit RGB codes if level is 0", () => {
    const chalk = createBrush({ level: 0 })
    expect(chalk.hex('#FF0000')('hello')).toBe('hello')
    expect(chalk.bgHex('#FF0000')('hello')).toBe('hello')
  })

  test('supports blackBright color', () => {
    expect(brush.blackBright('foo')).toBe('\u001B[90mfoo\u001B[39m')
  })

  test('sets correct level for chalkStderr and respects it', () => {
    expect(brushStderr.level).toBe(3)
    expect(brushStderr.red.bold('foo')).toBe('\u001B[31m\u001B[1mfoo\u001B[22m\u001B[39m')
  })

  test('keeps function prototype methods', () => {
    expect(brush.apply(brush, ['foo'])).toBe('foo')
    expect(brush.bind(brush, 'foo')()).toBe('foo')
    expect(brush.call(brush, 'foo')).toBe('foo')
  })
})
