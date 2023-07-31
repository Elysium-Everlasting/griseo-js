/**
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_.28Select_Graphic_Rendition.29_parameters
 */
export const SGR = {
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
export type SgrParameters = typeof SGR

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
type ColorPair = [SgrCode, SgrCode]

/**
 * A color mapping describes the SGR parameters for a color name.
 */
type ColorMapping = Record<string, ColorPair>

export const MODIFIER_COLORS = {
  reset: [SGR.RESET, SGR.RESET],
  bold: [SGR.BOLD, SGR.BOLD_OFF],
  dim: [SGR.DIM, SGR.BOLD_OFF],
  italic: [SGR.ITALIC, SGR.ITALIC_OFF],
  underline: [SGR.UNDERLINE, SGR.UNDERLINE_OFF],
  overline: [SGR.OVERLINE, SGR.OVERLINE_OFF],
  inverse: [SGR.NEGATIVE, SGR.NEGATIVE_OFF],
  hidden: [SGR.CONCEAL, SGR.CONCEAL_OFF],
  strikethrough: [SGR.STRIKETHROUGH, SGR.STRIKETHROUGH_OFF],
} satisfies ColorMapping

export const FOREGROUND_COLORS = {
  black: [SGR.FG_BLACK, SGR.FG_DEFAULT],
  red: [SGR.FG_RED, SGR.FG_DEFAULT],
  green: [SGR.FG_GREEN, SGR.FG_DEFAULT],
  yellow: [SGR.FG_YELLOW, SGR.FG_DEFAULT],
  blue: [SGR.FG_BLUE, SGR.FG_DEFAULT],
  magenta: [SGR.FG_MAGENTA, SGR.FG_DEFAULT],
  cyan: [SGR.FG_CYAN, SGR.FG_DEFAULT],
  white: [SGR.FG_WHITE, SGR.FG_DEFAULT],
  gray: [SGR.FG_BRIGHT_BLACK, SGR.FG_DEFAULT],
  grey: [SGR.FG_BRIGHT_BLACK, SGR.FG_DEFAULT],

  redBright: [SGR.FG_BRIGHT_RED, SGR.FG_DEFAULT],
  greenBright: [SGR.FG_BRIGHT_GREEN, SGR.FG_DEFAULT],
  yellowBright: [SGR.FG_BRIGHT_YELLOW, SGR.FG_DEFAULT],
  blueBright: [SGR.FG_BRIGHT_BLUE, SGR.FG_DEFAULT],
  magentaBright: [SGR.FG_BRIGHT_MAGENTA, SGR.FG_DEFAULT],
  cyanBright: [SGR.FG_BRIGHT_CYAN, SGR.FG_DEFAULT],
  whiteBright: [SGR.FG_BRIGHT_WHITE, SGR.FG_DEFAULT],
} satisfies ColorMapping

export const BACKGROUND_COLORS = {
  bgBlack: [SGR.BG_BLACK, SGR.BG_DEFAULT],
  bgRed: [SGR.BG_RED, SGR.BG_DEFAULT],
  bgGreen: [SGR.BG_GREEN, SGR.BG_DEFAULT],
  bgYellow: [SGR.BG_YELLOW, SGR.BG_DEFAULT],
  bgBlue: [SGR.BG_BLUE, SGR.BG_DEFAULT],
  bgMagenta: [SGR.BG_MAGENTA, SGR.BG_DEFAULT],
  bgCyan: [SGR.BG_CYAN, SGR.BG_DEFAULT],
  bgWhite: [SGR.BG_WHITE, SGR.BG_DEFAULT],
  bgGray: [SGR.BG_BRIGHT_BLACK, SGR.BG_DEFAULT],
  bgGrey: [SGR.BG_BRIGHT_BLACK, SGR.BG_DEFAULT],

  bgRedBright: [SGR.BG_BRIGHT_RED, SGR.BG_DEFAULT],
  bgGreenBright: [SGR.BG_BRIGHT_GREEN, SGR.BG_DEFAULT],
  bgYellowBright: [SGR.BG_BRIGHT_YELLOW, SGR.BG_DEFAULT],
  bgBlueBright: [SGR.BG_BRIGHT_BLUE, SGR.BG_DEFAULT],
  bgMagentaBright: [SGR.BG_BRIGHT_MAGENTA, SGR.BG_DEFAULT],
  bgCyanBright: [SGR.BG_BRIGHT_CYAN, SGR.BG_DEFAULT],
  bgWhiteBright: [SGR.BG_BRIGHT_WHITE, SGR.BG_DEFAULT],
} satisfies ColorMapping

export const ansiStyles = {
  ...MODIFIER_COLORS,
  ...FOREGROUND_COLORS,
  ...BACKGROUND_COLORS,
}

export const modifierNames = Object.keys(MODIFIER_COLORS)

export const foregroundColorNames = Object.keys(FOREGROUND_COLORS)

export const backgroundColorNames = Object.keys(BACKGROUND_COLORS)

export const colorNames = [...foregroundColorNames, ...backgroundColorNames]
