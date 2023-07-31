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
