import process from 'node:process'
import { describe, test, expect } from 'vitest'
import { chalk, chalkStderr, createChalk } from '../src/index.js'

chalk.level = 3
chalkStderr.level = 3

console.log('TERM:', process.env['TERM'] || '[none]')
console.log('platform:', process.platform || '[unknown]')

describe('chalk', () => {
  test("don't add any styling when called as the base function", () => {
    chalk('')
    expect(chalk('foo')).toBe('foo')
  })

  test('support multiple arguments in base function', () => {
    expect(chalk('hello', 'there')).toBe('hello there')
  })

  test('support automatic casting to string', () => {
    expect(chalk(['hello', 'there'])).toBe('hello,there')
    expect(chalk(123)).toBe('123')

    expect(chalk.bold(['foo', 'bar'])).toBe('\u001B[1mfoo,bar\u001B[22m')
    expect(chalk.green(98_765)).toBe('\u001B[32m98765\u001B[39m')
  })

  test('style string', () => {
    expect(chalk.underline('foo')).toBe('\u001B[4mfoo\u001B[24m')
    expect(chalk.red('foo')).toBe('\u001B[31mfoo\u001B[39m')
    expect(chalk.bgRed('foo')).toBe('\u001B[41mfoo\u001B[49m')
  })

  test('support applying multiple styles at once', () => {
    expect(chalk.red.bgGreen.underline('foo')).toBe(
      '\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39m',
    )

    expect(chalk.underline.red.bgGreen('foo')).toBe(
      '\u001B[4m\u001B[31m\u001B[42mfoo\u001B[49m\u001B[39m\u001B[24m',
    )
  })

  test('support nesting styles', () => {
    expect(chalk.red('foo' + chalk.underline.bgBlue('bar') + '!')).toBe(
      '\u001B[31mfoo\u001B[4m\u001B[44mbar\u001B[49m\u001B[24m!\u001B[39m',
    )
  })

  test('support nesting styles of the same type (color, underline, bg)', () => {
    expect(chalk.red('a' + chalk.yellow('b' + chalk.green('c') + 'b') + 'c')).toBe(
      '\u001B[31ma\u001B[33mb\u001B[32mc\u001B[39m\u001B[31m\u001B[33mb\u001B[39m\u001B[31mc\u001B[39m',
    )
  })

  test('reset all styles with `.reset()`', () => {
    expect(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo')).toBe(
      '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m',
    )
  })

  test('support caching multiple styles', () => {
    const { red, green } = chalk.red
    const redBold = red.bold
    const greenBold = green.bold

    expect(red('foo')).not.toBe(green('foo'))
    expect(redBold('bar')).not.toBe(greenBold('bar'))
    expect(green('baz')).not.toBe(greenBold('baz'))
  })

  test('alias gray to grey', () => {
    expect(chalk.grey('foo')).toBe('\u001B[90mfoo\u001B[39m')
  })

  test('support variable number of arguments', () => {
    expect(chalk.red('foo', 'bar')).toBe('\u001B[31mfoo bar\u001B[39m')
  })

  test('support falsy values', () => {
    expect(chalk.red(0)).toBe('\u001B[31m0\u001B[39m')
  })

  test("don't output escape codes if the input is empty", () => {
    expect(chalk.red('')).toBe('')
    expect(chalk.red.blue.black('')).toBe('')
  })

  test('keep Function.prototype methods', () => {
    expect(Reflect.apply(chalk.grey, null, ['foo'])).toBe('\u001B[90mfoo\u001B[39m')
    expect(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo')).toBe(
      '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m',
    )
    // expect(chalk.red.blue.black.call('')).toBe('')
  })

  test('line breaks should open and close colors', () => {
    expect(chalk.grey('hello\nworld')).toBe('\u001B[90mhello\u001B[39m\n\u001B[90mworld\u001B[39m')
  })

  test('line breaks should open and close colors with CRLF', () => {
    expect(chalk.grey('hello\r\nworld')).toBe(
      '\u001B[90mhello\u001B[39m\r\n\u001B[90mworld\u001B[39m',
    )
  })

  test('properly convert RGB to 16 colors on basic color terminals', () => {
    const chalk = createChalk({ level: 1 })
    expect(chalk.hex('#FF0000')('hello')).toBe('\u001B[91mhello\u001B[39m')
    expect(chalk.bgHex('#FF0000')('hello')).toBe('\u001B[101mhello\u001B[49m')
  })

  test('properly convert RGB to 256 colors on basic color terminals', () => {
    const chalk2 = createChalk({ level: 2 })
    expect(chalk2.hex('#FF0000')('hello')).toBe('\u001B[38;5;196mhello\u001B[39m')
    expect(chalk2.bgHex('#FF0000')('hello')).toBe('\u001B[48;5;196mhello\u001B[49m')

    const chalk3 = createChalk({ level: 3 })
    expect(chalk3.bgHex('#FF0000')('hello')).toBe('\u001B[48;2;255;0;0mhello\u001B[49m')
  })

  test("don't emit RGB codes if level is 0", () => {
    const chalk = createChalk({ level: 0 })
    expect(chalk.hex('#FF0000')('hello')).toBe('hello')
    expect(chalk.bgHex('#FF0000')('hello')).toBe('hello')
  })

  test('supports blackBright color', () => {
    expect(chalk.blackBright('foo')).toBe('\u001B[90mfoo\u001B[39m')
  })

  test('sets correct level for chalkStderr and respects it', () => {
    expect(chalkStderr.level).toBe(3)
    expect(chalkStderr.red.bold('foo')).toBe('\u001B[31m\u001B[1mfoo\u001B[22m\u001B[39m')
  })

  test('keeps function prototype methods', () => {
    expect(chalk.apply(chalk, ['foo'])).toBe('foo')
    expect(chalk.bind(chalk, 'foo')()).toBe('foo')
    expect(chalk.call(chalk, 'foo')).toBe('foo')
  })
})
