import { COLORS } from './sgr.js'

type Chalk = Record<keyof typeof COLORS, ChalkBuilder>

/**
 * Chainable function that will return the formatted text if called with a string argument.
 * Otherwise, it will return the same builder instance.
 */
interface ChalkBuilder extends Chalk {
  (text: string): string
  (): Chalk
}

/**
 * A string formatter accepts a string and returns a string decorated with ansi-colors.
 */
type Formatter = (text: string) => string

/**
 * Cached formatter functions.
 */
const formatters = new Map<string, Formatter>(
  Object.entries(COLORS).map(([key, [open, close]]) => [
    key,
    createFormatter(`\x1b[${open}m`, `\x1b[${close}m`),
  ]),
)

/**
 * Just a noop function as a placeholder for the proxy initialization.
 */
const chalkBuilder = (() => {}) as ChalkBuilder

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
export function createChalk(): Chalk {
  return Object.entries(COLORS).reduce((chalk, [key]) => {
    const handler = ((text) => {
      if (text) {
        return formatters.get(key)?.(text)
      } else {
        return createChalkBuilder(key as keyof Chalk)
      }
    }) as ChalkBuilder

    chalk[key as keyof Chalk] = handler

    Object.defineProperty(chalk, key, {
      get() {
        return createChalkBuilder(key as keyof Chalk)
      },
    })

    return chalk
  }, {} as Chalk)
}

/**
 * Chainable function to stylize strings.
 */
function createChalkBuilder(root: keyof Chalk): ChalkBuilder {
  const keys = [root]

  const chalk: typeof chalkBuilder = new Proxy(chalkBuilder, {
    get(_target, property: keyof Chalk, receiver) {
      keys.push(property)
      return receiver
    },
    apply(_target, _thisArg, argArray) {
      return argArray.length
        ? keys.reduce((string, key) => formatters.get(key)?.(string), argArray[0])
        : chalk
    },
  })

  return chalk
}

/**
 * Picocolors formatter.
 * @see https://github.com/alexeyraspopov/picocolors/blob/main/picocolors.js#L11
 */
function createFormatter(open: string, close: string, replace = open): Formatter {
  return (input: unknown) => {
    const string = '' + input
    const index = string.indexOf(close, open.length)
    return ~index
      ? open + replaceClose(string, close, replace, index) + close
      : open + string + close
  }
}

/**
 * Picocolors replacement function.
 * @see https://github.com/alexeyraspopov/picocolors/blob/main/picocolors.js#L21
 */
function replaceClose(string: string, close: string, replace: string, index: number): string {
  let start = string.substring(0, index) + replace
  let end = string.substring(index + close.length)
  let nextIndex = end.indexOf(close)
  return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end
}

export const chalk = createChalk()
