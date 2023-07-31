import { COLORS } from './sgr.js'

type Chalk = Record<keyof typeof COLORS, ChalkBuilder>

/**
 * Chainable function that will return the formatted text if called with a string argument.
 * Otherwise, it will return the same builder instance.
 */
interface ChalkBuilder {
  (text: string): string
  (): Chalk
}

/**
 * Cached formatter functions.
 */
const formatters = new Map<string, (text: string) => string>()

/**
 * Just a noop function as a placeholder for the proxy initialization.
 */
function noop() {}

export function createChalk(): Chalk {
  return Object.entries(COLORS).reduce((chalk, [key, [open, close]]) => {
    const formatter = formatters.get(key) || createFormatter(`\x1b[${open}m`, `\x1b[${close}m`)

    if (!formatters.get(key)) {
      formatters.set(key, formatter)
    }

    chalk[key as keyof Chalk] = ((text) => {
      if (text) {
        return formatter(text)
      } else {
        return createChalkBuilder(key as keyof Chalk)
      }
    }) as ChalkBuilder

    return chalk
  }, {} as Chalk)
}

function createChalkBuilder(root: keyof Chalk) {
  const keys = [root]

  const chalk: any = new Proxy(noop, {
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

function createFormatter(open: string, close: string, replace = open) {
  return (input: unknown) => {
    const string = '' + input
    const index = string.indexOf(close, open.length)
    return ~index
      ? open + replaceClose(string, close, replace, index) + close
      : open + string + close
  }
}

function replaceClose(string: string, close: string, replace: string, index: number): string {
  let start = string.substring(0, index) + replace
  let end = string.substring(index + close.length)
  let nextIndex = end.indexOf(close)
  return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end
}

export const chalk = createChalk()
