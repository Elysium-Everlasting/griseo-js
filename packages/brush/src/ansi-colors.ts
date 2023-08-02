import { COLORS, type ColorPair } from './lib/sgr.js'

/**
 * The premiere Chalk API.
 */
type Chalk = Metadata & ChalkBuilder

interface Metadata {
  enabled: boolean
  visible: boolean
  styles: Map<string, Formatter>
}

interface ChalkBuilder extends Record<keyof typeof COLORS, ChalkBuilder> {
  (input: unknown): string
}

/**
 * Function that properly formats a string with ANSI styles.
 */
type Formatter = (input: string, newline?: boolean) => string

/**
 * Define a color for the chalk instance.
 */
function defineColor(chalk: Chalk, name: string, codes: ColorPair): void {
  chalk.styles.set(name, createAnsiFormatter(codes))

  Object.defineProperty(chalk, name, {
    configurable: true,
    enumerable: true,
    get() {
      const color = (input: unknown) => style(chalk, input, color.stack)
      color.stack = this.stack ? this.stack.concat(name) : [name]
      Object.setPrototypeOf(color, chalk)
      return color
    },
  })
}

/**
 * Create a formatter function.
 */
function createAnsiFormatter(codes: ColorPair): Formatter {
  const open = `\u001b[${codes[0]}m`
  const close = `\u001b[${codes[1]}m`
  const regex = new RegExp(`\\u001b\\[${codes[1]}m`, 'g')

  const formatter: Formatter = (rawInput, newline) => {
    const input = rawInput.includes(close) ? rawInput.replace(regex, close + open) : rawInput

    const output = open + input + close

    /**
     * @see https://github.com/chalk/chalk/pull/92
     * Thanks to the chalk contributors for this fix.
     * However, we've confirmed that this issue is also present in Windows terminals
     */
    return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output
  }

  return formatter
}

/**
 * @param chalk The {@link Chalk} instance.
 * @param input The input to be represented as a string.
 * @param keys An array of strings representing styles to be applied.
 */
function style(chalk: Chalk, input: unknown, keys: string[]) {
  if (!input || !chalk.visible) {
    return ''
  }

  if (!chalk.enabled) {
    return input
  }

  const styles = keys.includes('unstyle') ? [...new Set(['unstyle', ...keys])].reverse() : keys

  let str = '' + input
  const newline = str.includes('\n')

  return styles.reduce((string, style) => {
    return chalk.styles.get(style)?.(string, newline) ?? string
  }, str)
}

/**
 * Create a new {@link Chalk} instance.
 */
function createChalk() {
  const chalk = {} as Chalk

  chalk.enabled = true
  chalk.visible = true
  chalk.styles = new Map()

  Object.entries(COLORS).forEach(([name, codes]) => defineColor(chalk, name, codes))

  return chalk
}

export const chalk = createChalk()
