import tty from 'node:tty'
import { ansiStyles } from './sgr-parameters.js'

const noColor = 'NO_COLOR' in process.env || process.argv.includes('--no-color')
const forceColor = 'FORCE_COLOR' in process.env || process.argv.includes('--color')
const isWindows = process.platform === 'win32'
const isCi = 'CI' in process.env

/**
 * Shouldn't use escape sequences in dumb terminals.
 *
 * @see https://stackoverflow.com/a/39005551
 * @see https://github.com/ipython/ipython/issues/9886#issue-172006147
 */
const dumbTerminal = tty.isatty(1) && process.env['TERM'] === 'dumb'

const IS_COLOR_SUPPORTED = !noColor && (forceColor || isWindows || dumbTerminal || isCi)

function formatter(open: string, close: string, replace = open) {
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

type Chalk = Record<keyof typeof ansiStyles, ChalkBuilder>

interface ChalkBuilder {
  (text: string): string
  (): Chalk
}

const formatters = new Map<string, (text: string) => string>()

/**
 * Just a noop function as a placeholder for the proxy initialization.
 */
function noop() {}

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

function createChalk(): Chalk {
  return Object.entries(ansiStyles).reduce((chalk, [key, [open, close]]) => {
    if (!formatters.has(key)) {
      formatters.set(key, formatter(`\x1b[${open}m`, `\x1b[${close}m`))
    }
    chalk[key as keyof Chalk] = ((text) => {
      if (text) {
        return formatters.get(key)?.(text)
      } else {
        return createChalkBuilder(key as keyof Chalk)
      }
    }) as ChalkBuilder
    return chalk
  }, {} as Chalk)
}

export const chalk = createChalk()
