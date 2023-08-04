/**
 * An RGB color is a tuple of [red, green, blue] values,
 * where each value is an integer between 0 and 255.
 */
export type RgbColor = [number, number, number]

/**
 * Idk where this comes from.
 */
const ANSI_BACKGROUND_OFFSET = 10

/**
 * Returns a function that wraps a provided code with the ANSI (16 color support) escape code.
 */
export function wrapAnsi16(offset = 0) {
  return (code: number) => `\u001B[${code + offset}m`
}

/**
 * Returns a function that wraps a provided code with the ANSI (256 color support) escape code.
 */
export function wrapAnsi256(offset = 0) {
  return (code: number) => `\u001B[${38 + offset};5;${code}m`
}

/**
 * Returns a function that wraps a provided code with the ANSI (16 million color support) escape code.
 */
export function wrapAnsi16m(offset = 0) {
  return (...rgb: RgbColor) => `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`
}

/**
 * Converts an RGB color to an ANSI 256 color code.
 */
export function rgbToAnsi256(...rgb: RgbColor): number {
  const [red, green, blue] = rgb

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

/**
 * Converts a hex color to an RGB color.
 */
export function hexToRgb(hex: number | string): RgbColor {
  const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16))
  if (!matches) {
    return [0, 0, 0]
  }

  let [colorString] = matches

  if (colorString.length === 3) {
    colorString = [...colorString].map((character) => character + character).join('')
  }

  const integer = Number.parseInt(colorString, 16)

  return [(integer >> 16) & 0xff, (integer >> 8) & 0xff, (integer >> 0) & 0xff]
}

/**
 * Converts a hex color to an ANSI 256 color code.
 */
export function hexToAnsi256(hex: number): number {
  return rgbToAnsi256(...hexToRgb(hex))
}

/**
 * Converts an ANSI 256 color code to an ANSI 16 color code.
 */
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

/**
 * Converts an RGB color to an ANSI 16 color code.
 */
export function rgbToAnsi(...color: RgbColor): number {
  return ansi256ToAnsi(rgbToAnsi256(...color))
}

/**
 * Converts a hex color to an ANSI 16 color code.
 */
export function hexToAnsi(hex: number): number {
  return ansi256ToAnsi(hexToAnsi256(hex))
}

/**
 * Number of colors supported.
 *
 * - `ansi` - 16 colors.
 * - `ansi256` - 256 colors.
 * - `ansi16m` - 16 million colors (RGB).
 */
export type ColorSupport = 'ansi' | 'ansi256' | 'ansi16m'

/**
 * Functions that take a __foreground__ color code and wrap it with the appropriate ANSI escape code.
 */
export const colorWrappers = {
  ansi: wrapAnsi16(),
  ansi256: wrapAnsi256(),
  ansi16m: wrapAnsi16m(),
} as const satisfies Record<ColorSupport, Function>

/**
 * Functions that take a __background__ color code and wrap it with the appropriate ANSI escape code.
 */
export const bgColorWrappers = {
  ansi: wrapAnsi16(ANSI_BACKGROUND_OFFSET),
  ansi256: wrapAnsi256(ANSI_BACKGROUND_OFFSET),
  ansi16m: wrapAnsi16m(ANSI_BACKGROUND_OFFSET),
} as const satisfies Record<ColorSupport, Function>

/**
 * Functions that take a color code and wrap it with the appropriate ANSI escape code.
 */
export const wrappers = {
  color: colorWrappers,
  bgColor: bgColorWrappers,
}
