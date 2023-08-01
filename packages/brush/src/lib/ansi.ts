export type RgbColor = [number, number, number]

const ANSI_BACKGROUND_OFFSET = 10

type Wrapper = (...args: any[]) => string

function wrapAnsi16(offset = 0): Wrapper {
  return (code: number) => `\u001B[${code + offset}m`
}

function wrapAnsi256(offset = 0): Wrapper {
  return (code: number) => `\u001B[${38 + offset};5;${code}m`
}

function wrapAnsi16m(offset = 0): Wrapper {
  return (...rgb: RgbColor) => `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`
}

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

export function hexToRgb(hex: number): RgbColor {
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

export function hexToAnsi256(hex: number): number {
  return rgbToAnsi256(...hexToRgb(hex))
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

export function rgbToAnsi(...color: RgbColor): number {
  return ansi256ToAnsi(rgbToAnsi256(...color))
}

export function hexToAnsi(hex: number): number {
  return ansi256ToAnsi(hexToAnsi256(hex))
}

export type ColorType = 'ansi' | 'ansi256' | 'ansi16m'

export const colorWrappers = {
  ansi: wrapAnsi16(),
  ansi256: wrapAnsi256(),
  ansi16m: wrapAnsi16m(),
} as const satisfies Record<ColorType, Wrapper>

export const bgColorWrappers = {
  ansi: wrapAnsi16(ANSI_BACKGROUND_OFFSET),
  ansi256: wrapAnsi256(ANSI_BACKGROUND_OFFSET),
  ansi16m: wrapAnsi16m(ANSI_BACKGROUND_OFFSET),
} as const satisfies Record<ColorType, Wrapper>

export const wrappers = {
  color: colorWrappers,
  bgColor: bgColorWrappers,
}
