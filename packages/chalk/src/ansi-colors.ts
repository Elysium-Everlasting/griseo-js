/**
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_.28Select_Graphic_Rendition.29_parameters
 */
export const SGR_PARAMETERS = {
  RESET: 0,
  BOLD: 1,
  DIM: 2,
  ITALIC: 3,
  UNDERLINE: 4,
  BLINK_SLOW: 5,
  BLINK_FAST: 6,
  NEGATIVE: 7,
  CONCEAL: 8,
  STRIKETHROUGH: 9,
  BOLD_OFF: 22,
  ITALIC_OFF: 23,
  UNDERLINE_OFF: 24,
  BLINK_OFF: 25,
  NEGATIVE_OFF: 27,
  CONCEAL_OFF: 28,
  STRIKETHROUGH_OFF: 29,
  OVERLINE: 53,
  OVERLINE_OFF: 55,

  FG_BLACK: 30,
  FG_RED: 31,
  FG_GREEN: 32,
  FG_YELLOW: 33,
  FG_BLUE: 34,
  FG_MAGENTA: 35,
  FG_CYAN: 36,
  FG_WHITE: 37,
  FG_DEFAULT: 39,
  FG_BRIGHT_BLACK: 90,
  FG_BRIGHT_RED: 91,
  FG_BRIGHT_GREEN: 92,
  FG_BRIGHT_YELLOW: 93,
  FG_BRIGHT_BLUE: 94,
  FG_BRIGHT_MAGENTA: 95,
  FG_BRIGHT_CYAN: 96,
  FG_BRIGHT_WHITE: 97,

  BG_BLACK: 40,
  BG_RED: 41,
  BG_GREEN: 42,
  BG_YELLOW: 43,
  BG_BLUE: 44,
  BG_MAGENTA: 45,
  BG_CYAN: 46,
  BG_WHITE: 47,
  BG_DEFAULT: 49,
  BG_BRIGHT_BLACK: 100,
  BG_BRIGHT_RED: 101,
  BG_BRIGHT_GREEN: 102,
  BG_BRIGHT_YELLOW: 103,
  BG_BRIGHT_BLUE: 104,
  BG_BRIGHT_MAGENTA: 105,
  BG_BRIGHT_CYAN: 106,
  BG_BRIGHT_WHITE: 107,
} as const

/**
 * Recognized SGR parameters.
 */
export type SgrParameters = typeof SGR_PARAMETERS

/**
 * Recognized SGR parameter names.
 */
export type SgrParameterName = keyof SgrParameters

/**
 * Recognized SGR code values.
 */
export type SgrCode = SgrParameters[SgrParameterName]

/**
 * A color pair describes the opening and closing SGR parameters for a colored string.
 */
type ColorPair = [SgrParameterName, SgrParameterName]

/**
 * A color mapping describes the SGR parameters for a color name.
 */
type ColorMapping = Record<string, ColorPair>

export const MODIFIER_COLORS = {
  reset: ['RESET', 'RESET'],
  bold: ['BOLD', 'BOLD_OFF'],
  dim: ['DIM', 'BOLD_OFF'],
  italic: ['ITALIC', 'ITALIC_OFF'],
  underline: ['UNDERLINE', 'UNDERLINE_OFF'],
  overline: ['OVERLINE', 'OVERLINE_OFF'],
  inverse: ['NEGATIVE', 'NEGATIVE_OFF'],
  hidden: ['CONCEAL', 'CONCEAL_OFF'],
  strikethrough: ['STRIKETHROUGH', 'STRIKETHROUGH_OFF'],
} satisfies ColorMapping

export const FOREGROUND_COLORS = {
  black: ['FG_BLACK', 'FG_DEFAULT'],
  red: ['FG_RED', 'FG_DEFAULT'],
  green: ['FG_GREEN', 'FG_DEFAULT'],
  yellow: ['FG_YELLOW', 'FG_DEFAULT'],
  blue: ['FG_BLUE', 'FG_DEFAULT'],
  magenta: ['FG_MAGENTA', 'FG_DEFAULT'],
  cyan: ['FG_CYAN', 'FG_DEFAULT'],
  white: ['FG_WHITE', 'FG_DEFAULT'],
  gray: ['FG_BRIGHT_BLACK', 'FG_DEFAULT'],
  grey: ['FG_BRIGHT_BLACK', 'FG_DEFAULT'],

  redBright: ['FG_BRIGHT_RED', 'FG_DEFAULT'],
  greenBright: ['FG_BRIGHT_GREEN', 'FG_DEFAULT'],
  yellowBright: ['FG_BRIGHT_YELLOW', 'FG_DEFAULT'],
  blueBright: ['FG_BRIGHT_BLUE', 'FG_DEFAULT'],
  magentaBright: ['FG_BRIGHT_MAGENTA', 'FG_DEFAULT'],
  cyanBright: ['FG_BRIGHT_CYAN', 'FG_DEFAULT'],
  whiteBright: ['FG_BRIGHT_WHITE', 'FG_DEFAULT'],
} satisfies ColorMapping

export const BACKGROUND_COLORS = {
  bgBlack: ['BG_BLACK', 'BG_DEFAULT'],
  bgRed: ['BG_RED', 'BG_DEFAULT'],
  bgGreen: ['BG_GREEN', 'BG_DEFAULT'],
  bgYellow: ['BG_YELLOW', 'BG_DEFAULT'],
  bgBlue: ['BG_BLUE', 'BG_DEFAULT'],
  bgMagenta: ['BG_MAGENTA', 'BG_DEFAULT'],
  bgCyan: ['BG_CYAN', 'BG_DEFAULT'],
  bgWhite: ['BG_WHITE', 'BG_DEFAULT'],
  bgGray: ['BG_BRIGHT_BLACK', 'BG_DEFAULT'],
  bgGrey: ['BG_BRIGHT_BLACK', 'BG_DEFAULT'],

  bgRedBright: ['BG_BRIGHT_RED', 'BG_DEFAULT'],
  bgGreenBright: ['BG_BRIGHT_GREEN', 'BG_DEFAULT'],
  bgYellowBright: ['BG_BRIGHT_YELLOW', 'BG_DEFAULT'],
  bgBlueBright: ['BG_BRIGHT_BLUE', 'BG_DEFAULT'],
  bgMagentaBright: ['BG_BRIGHT_MAGENTA', 'BG_DEFAULT'],
  bgCyanBright: ['BG_BRIGHT_CYAN', 'BG_DEFAULT'],
  bgWhiteBright: ['BG_BRIGHT_WHITE', 'BG_DEFAULT'],
} satisfies ColorMapping

export const modifierNames = Object.keys(MODIFIER_COLORS)

export const foregroundColorNames = Object.keys(FOREGROUND_COLORS)

export const backgroundColorNames = Object.keys(BACKGROUND_COLORS)

export const colorNames = [...foregroundColorNames, ...backgroundColorNames]

// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js

export function rgbToAnsi256(red: number, green: number, blue: number): number {
  // We use the extended greyscale palette here, with the exception of black and white.
  // Normal palette only has 4 greyscale shades.
  if (red === green && green === blue) {
    if (red < 8) {
      return 16
    }

    if (red > 248) {
      return 231
    }

    return Math.round(((red - 8) / 247) * 24) + 232
  }

  return (
    16 +
    36 * Math.round((red / 255) * 5) +
    6 * Math.round((green / 255) * 5) +
    1 * Math.round((blue / 255) * 5)
  )
}

export function hexToRgb(hex: number): [number, number, number] {
  const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16))

  if (!matches) {
    return [0, 0, 0]
  }

  let [colorString] = matches

  if (colorString.length === 3) {
    colorString = [...colorString].map((character) => character + character).join('')
  }

  const integer = Number.parseInt(colorString, 16)

  return [(integer >> 16) & 0xff, (integer >> 8) & 0xff, integer & 0xff]
}

export function hexToAnsi256(hex: number): number {
  const rgb = hexToRgb(hex)
  return rgbToAnsi256(rgb[0], rgb[1], rgb[2])
}

export function ansi256ToAnsi(code: number): number {
  if (code < 8) {
    return 30 + code
  }

  if (code < 16) {
    return 90 + (code - 8)
  }

  let red
  let green
  let blue

  if (code >= 232) {
    red = ((code - 232) * 10 + 8) / 255
    green = red
    blue = red
  } else {
    code -= 16

    const remainder = code % 36

    red = Math.floor(code / 36) / 5
    green = Math.floor(remainder / 6) / 5
    blue = (remainder % 6) / 5
  }

  const value = Math.max(red, green, blue) * 2

  if (value === 0) {
    return 30
  }

  let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red))

  if (value === 2) {
    result += 60
  }

  return result
}

export function rgbToAnsi(red: number, green: number, blue: number): number {
  return ansi256ToAnsi(rgbToAnsi256(red, green, blue))
}

export function hexToAnsi(hex: number): number {
  return ansi256ToAnsi(hexToAnsi256(hex))
}

const ANSI_BACKGROUND_OFFSET = 10

const wrapAnsi16 =
  (offset = 0) =>
  (code: number) =>
    `\u001B[${code + offset}m`

const wrapAnsi256 =
  (offset = 0) =>
  (code: number) =>
    `\u001B[${38 + offset};5;${code}m`

const wrapAnsi16m =
  (offset = 0) =>
  (red: number, green: number, blue: number) =>
    `\u001B[${38 + offset};2;${red};${green};${blue}m`

export const ansiStyles = {
  ...MODIFIER_COLORS,
  ...FOREGROUND_COLORS,
  ...BACKGROUND_COLORS,
}

export const createAnsi = {
  foreground: {
    16: wrapAnsi16(),
    256: wrapAnsi256(),
    '16m': wrapAnsi16m(),
  },
  background: {
    16: wrapAnsi16(ANSI_BACKGROUND_OFFSET),
    256: wrapAnsi256(ANSI_BACKGROUND_OFFSET),
    '16m': wrapAnsi16m(ANSI_BACKGROUND_OFFSET),
  },
}

type Chalk = Record<keyof typeof ansiStyles, ChalkBuilder>

interface ChalkBuilder {
  (text: string): string
  (): Chalk
}

function formatter(open: string, close: string, replace = open) {
  return (input: unknown) => {
    let string = '' + input
    let index = string.indexOf(close, open.length)
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

function printChalk(text: string, ...colors: (keyof Chalk)[]) {
  const openers: string[] = []
  const closers: string[] = []

  for (const color of colors) {
    openers.push(`\x1b[${SGR_PARAMETERS[ansiStyles[color][0]]}m`)
    closers.unshift(`\x1b[${SGR_PARAMETERS[ansiStyles[color][1]]}m`)
  }

  return `${openers.join('')}${text}${closers.join('')}`
}

const REPLACE = '{TEXT}'

const handler = () => {}

function createProxiedArray(root: keyof Chalk) {
  let string =
    '\x1b[' +
    SGR_PARAMETERS[ansiStyles[root][0]] +
    'm' +
    REPLACE +
    '\x1b[' +
    SGR_PARAMETERS[ansiStyles[root][1]] +
    'm'

  const chalk: typeof handler = new Proxy(handler, {
    get(_target, property: keyof Chalk, receiver) {
      string =
        '\x1b[' +
        SGR_PARAMETERS[ansiStyles[property][0]] +
        'm' +
        string +
        '\x1b[' +
        SGR_PARAMETERS[ansiStyles[property][1]] +
        'm'
      return receiver
    },
    apply(_target, _thisArg, argArray) {
      return argArray.length ? string.replace(REPLACE, argArray[0]) : chalk
    },
  })

  return chalk
}

function createChalk(): Chalk {
  const chalk = Object.keys(ansiStyles).reduce((current, key) => {
    current[key as keyof Chalk] = ((text) => {
      if (text) {
        return printChalk(text, key as keyof Chalk)
      } else {
        return createProxiedArray(key as keyof Chalk)
      }
    }) as ChalkBuilder
    return current
  }, {} as Chalk)

  return chalk
}

const chalk = createChalk()

console.log(chalk.red().bgBlue().italic().bold('HELLLOOOOOO'))

console.log(
  chalk.red('.') +
    chalk.yellow('.') +
    chalk.green('.') +
    chalk.bgRed(chalk.black(' ERROR ')) +
    chalk.red(' Add plugin ' + chalk.yellow('name') + ' to use time limit with '),
)
