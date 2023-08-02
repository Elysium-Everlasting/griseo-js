import { COLORS, SGR_PARAMETERS } from '@griseo-js/easel/sgr'

import {
  stderr as stderrColor,
  stdout as stdoutColor,
  type ColorSupportLevel,
} from '@griseo-js/easel/color-support/node'

import {
  wrappers,
  hexToRgb,
  rgbToAnsi,
  rgbToAnsi256,
  type RgbColor,
  type ColorType,
} from '@griseo-js/easel/ansi'

/**
 * The premiere Chalk API.
 */
export type Chalk = Metadata & ChalkBuilder & TrueColorBuilders & Metadata

/**
 * Top level properties on the Chalk instance.
 */
export interface Metadata {
  level: ColorSupportLevel
  truecolor: TrueColorFormatters
}

/**
 * Chainable function that will return the formatted text if called with a string argument.
 * Otherwise, it will return the same builder instance.
 */
export interface ChalkBuilder
  extends Record<keyof typeof COLORS, ChalkBuilder>,
    TrueColorBuilders,
    Metadata {
  (...text: unknown[]): string
  (): Chalk
}

/**
 * True color functions that return a ChalkBuilder instance.
 */
export interface TrueColorBuilders {
  rgb(...rgb: RgbColor): ChalkBuilder
  bgRgb(...rgb: RgbColor): ChalkBuilder
  hex(hex: string): ChalkBuilder
  bgHex(hex: string): ChalkBuilder
  ansi256(code: number): ChalkBuilder
  bgAnsi256(code: number): ChalkBuilder
}

/**
 * Functions that create formatters with true color support.
 */
export interface TrueColorFormatters {
  rgb(...rgb: RgbColor): Formatter
  bgRgb(...rgb: RgbColor): Formatter
  hex(hex: number): Formatter
  bgHex(hex: number): Formatter
  ansi256(code: number): Formatter
  bgAnsi256(code: number): Formatter
}

/**
 * Just a noop function used as a placeholder for the proxy initialization.
 */
const chalkBuilder = (() => {}) as ChalkBuilder

/**
 * Translates a {@link ColorSupportLevel} to a {@link ColorType}.
 */
export const levelToColorType = {
  0: 'ansi',
  1: 'ansi',
  2: 'ansi256',
  3: 'ansi16m',
} as const satisfies Record<ColorSupportLevel, ColorType>

/**
 * A string formatter accepts a string and returns a string decorated with ansi-colors.
 */
export type Formatter = (text: string, newline: boolean, chalk: Chalk) => string

/**
 * Cached formatter functions.
 * All fixed colors can be initially cached.
 * Dynamically created ones, i.e. true-color formatters, are cached on first use.
 */
export const formatters = new Map<string, Formatter>(
  Object.entries(COLORS).map(([key, [open, close]]) => [
    key,
    createFormatter(`\x1b[${open}m`, `\x1b[${close}m`, new RegExp(`\\u001b\\[${close}m`, 'g')),
  ]),
)

/**
 * ansi-colors formatter. Apparently this is the superior and least buggy implementation :)
 * @see https://github.com/doowb/ansi-colors/blob/master/index.js#L24
 */
function createFormatter(open: string, close: string, replace: string | RegExp = close): Formatter {
  return (rawInput, newline, chalk) => {
    if ((chalk.level != null && chalk.level <= 0) || !rawInput) {
      return rawInput
    }

    const input = rawInput.includes(close) ? rawInput.replace(replace, close + open) : rawInput

    const output = open + input + close

    /**
     * @see https://github.com/chalk/chalk/pull/92
     * Thanks to the chalk contributors for this fix.
     * However, we've confirmed that this issue is also present in Windows terminals
     */
    return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output
  }
}

/**
 * Extension of the simple formatters to create true-color formatters.
 */
function createTrueColorFormatters(options: Options): TrueColorFormatters {
  const resetFg = `\x1b[${SGR_PARAMETERS.FG_DEFAULT}m`
  const resetBg = `\x1b[${SGR_PARAMETERS.BG_DEFAULT}m`

  const fgDefault = new RegExp(`\\u001b\\[${SGR_PARAMETERS.FG_DEFAULT}m`, 'g')
  const bgDefault = new RegExp(`\\u001b\\[${SGR_PARAMETERS.RESET}m`, 'g')

  return {
    rgb(...rgb) {
      const level = levelToColorType[options.level ?? 0]
      switch (level) {
        case 'ansi':
          return createFormatter(wrappers.color[level](rgbToAnsi(...rgb)), resetFg, fgDefault)
        case 'ansi256':
          return createFormatter(wrappers.color[level](rgbToAnsi256(...rgb)), resetFg, fgDefault)
        case 'ansi16m':
          return createFormatter(wrappers.color[level](...rgb), resetFg, fgDefault)
      }
    },
    bgRgb(...rgb) {
      const level = levelToColorType[options.level ?? 0]
      switch (level) {
        case 'ansi':
          return createFormatter(wrappers.bgColor[level](rgbToAnsi(...rgb)), resetBg, bgDefault)
        case 'ansi256':
          return createFormatter(wrappers.bgColor[level](rgbToAnsi256(...rgb)), resetBg, bgDefault)
        case 'ansi16m':
          return createFormatter(wrappers.bgColor[level](...rgb), resetBg, bgDefault)
      }
    },
    hex(hex) {
      return this.rgb(...hexToRgb(hex))
    },
    bgHex(hex) {
      return this.bgRgb(...hexToRgb(hex))
    },
    ansi256(code) {
      return createFormatter(wrappers.color.ansi256(code), resetFg)
    },
    bgAnsi256(code) {
      return createFormatter(wrappers.bgColor.ansi256(code), resetBg)
    },
  }
}

export interface Options {
  /**
   * Specify the color support for Chalk.
   * By default, color support is automatically detected based on the environment.
   * Levels:
   *  - `0` - All colors disabled.
   *  - `1` - Basic 16 colors support.
   *  - `2` - ANSI 256 colors support.
   *  - `3` - True color 16 million colors support.
   */
  level?: ColorSupportLevel
}

/**
 * If the first argument is a string, just format it directly.
 * This yields similar performance to Picocolors.
 *
 * If the first argument is undefined, then create a new builder.
 * The chaining on this builder is actually faster than Kleur for some reason,
 * but slower than Chalk because it uses a {@link Proxy}.
 *
 * Better chaining performance can be achieved by manipulating prototypes,
 * but I don't think it's worth the effort.
 */
export function createChalk(options: Options = {}): Chalk {
  if (
    options.level &&
    !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)
  ) {
    throw new Error('The `level` option should be an integer from 0 to 3')
  }

  const chalk = ((...text: unknown[]) => text.join(' ')) as Chalk

  chalk.level = options.level != null ? options.level : stdoutColor ? stdoutColor.level : 0
  chalk.truecolor = createTrueColorFormatters(chalk)

  Object.assign(chalk, chalk.truecolor)

  Object.entries(COLORS).forEach(([key]) => {
    Object.defineProperty(chalk, key, {
      get: () => createChalkBuilder(key as keyof ChalkBuilder, chalk),
    })
  })

  // Append the true color formatters to the root chalk instance.
  Object.entries(chalk.truecolor).forEach(([key, formatter]) => {
    Object.defineProperty(chalk, key, {
      get: ((...args: unknown[]) => {
        const text = args.length === 1 ? '' + args[0] : args.join(' ')
        if (text) {
          return formatter(text, text.includes('\n'), chalk)
        } else {
          return createChalkBuilder(key as keyof ChalkBuilder, chalk)
        }
      }) as ChalkBuilder,
    })
  })

  return chalk
}

/**
 * Directly create a chainable function to stylize strings.
 */
export function createChalkBuilder(root: keyof ChalkBuilder, chalk: Chalk): ChalkBuilder {
  const keys = [root]

  const innerChalkBuilder: typeof chalkBuilder = new Proxy(chalkBuilder, {
    get(_target, property: keyof Chalk, receiver) {
      if (property === 'level') {
        return chalk[property]
      } else {
        keys.push(property as keyof ChalkBuilder)
        return receiver
      }
    },
    set(_target, p, newValue, _receiver) {
      chalk[p as keyof Chalk] = newValue
      return true
    },

    apply(_target, _thisArg, argArray) {
      // If the chained function was called with no args, then always return the instance.

      if (!argArray.length) {
        return innerChalkBuilder
      }

      // If the chained function was called with some args, the following are possible:
      // 1. It was called with a string to be formatted
      // 2. A true-color function was called to create a new formatter.

      const lastKey = keys.at(-1)

      // If the most recent key references a true-color function:
      //  1. Replace the last key with a new key representing the true-color formatter function.
      //  2. Add this formatter function to the cache if needed.
      //  3. Return the chalk instance.
      if (lastKey && lastKey in chalk.truecolor) {
        keys.pop()

        /**
         * @example `rgb(255, 255, 255)`
         */
        const trueColorKey = `${lastKey}(${argArray}) - level ${chalk.level}`

        keys.push(trueColorKey as keyof ChalkBuilder)

        if (!formatters.get(trueColorKey)) {
          formatters.set(trueColorKey, (chalk.truecolor as any)[lastKey](...argArray, chalk))
        }

        return innerChalkBuilder
      }

      const text = argArray.length === 1 ? '' + argArray[0] : argArray.join(' ')
      const newline = text.includes('\n')

      /**
       * If no string to format, or {@link Options.level} is too low, just return the unformatted string.
       */
      return argArray[0] == null || (chalk.level && chalk.level <= 0)
        ? argArray[0]
        : keys
            .reverse()
            .reduce((string, key) => formatters.get(key)?.(string, newline, chalk) ?? string, text)
    },
  })

  return innerChalkBuilder
}

export const chalk = createChalk()

export const chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 })

export { stdoutColor as supportsColor, stderrColor as supportsColorStderr }
