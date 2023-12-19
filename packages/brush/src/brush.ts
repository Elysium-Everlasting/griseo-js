import {
  wrappers,
  hexToRgb,
  rgbToAnsi,
  rgbToAnsi256,
  type RgbColor,
  type ColorSupport,
} from '@griseo.js/palette/ansi'
import type { ColorSupportLevel } from '@griseo.js/palette/color-support'
import { COLORS, SGR_PARAMETERS } from '@griseo.js/palette/sgr'

/**
 * Brush initialization options.
 */
export interface Options {
  /**
   * Explicitly set the desired color support for the brush.
   *
   * @see https://github.com/termstandard/colors
   *
   * Levels:
   * 0 - All colors disabled.
   * 1 - Basic 16 colors support.
   * 2 - ANSI 256 colors support.
   * 3 - Truecolor 16 million colors support.
   */
  level?: ColorSupportLevel
}

/**
 * Use a brush to beautifully color your terminal output!
 *
 * When chaining, order doesn't matter, and later styles have higher priority in case of a conflict.
 * i.e. `brush.red.yellow.green` is equivalent to `brush.green`.
 */
export type Brush = BrushState & BrushStroke

/**
 * Current state of the brush.
 */
type BrushState = {
  /**
   * Indicates the supported range of colors.
   *
   * @default Inferred based on the terminal environment when using a Node.js or browser specific brush.
   */
  level: ColorSupportLevel
}

/**
 * Represents a nested instance of {@link Brush}.
 *
 * i.e. A string is formatted by applying brush strokes.
 */
export interface BrushStroke extends ColorStrokes, TrueColorStrokes, UtilityStrokes, BrushState {
  /**
   * Like Kleur, invoking a {@link BrushStroke} without any arguments will return a nested instance.
   *
   * @see https://github.com/lukeed/kleur/tree/master#chained-methods
   */
  (): BrushStroke

  /**
   * Invoking a stroke with any number of arguments will return a formatted string.
   */
  (...args: unknown[]): string

  /**
   * The opening ANSI escape code for the stroke.
   *
   * When chaining, this can be multiple escape codes long; otherwise it's just one code.
   */
  open: string

  /**
   * The closing ANSI escape code for the stroke.
   *
   * When chaining, this can be multiple escape codes long; otherwise it's just one code.
   */
  close: string

  /**
   * Whether `visible` was toggled at any point in the chain.
   *
   * When this flag is on, the input is only displayed if {@link Brush.level} is greater than 0.
   */
  visibleOn?: boolean
}

/**
 * Brush strokes that apply predefined colors.
 */
type ColorStrokes = {
  [K in keyof typeof COLORS]: BrushStroke
}

/**
 * Brush strokes that apply true colors.
 *
 * These differ from regular {@link ColorStrokes} because they need to be
 * called with the desired color value before generating a {@link BrushStroke}.
 */
type TrueColorStrokes = {
  /**
   * Use RGB values to set text color.
   *
   * @example
   * ```ts
   * import { brush } from '@griseo.js/brush';
   * brush.rgb(222, 173, 237);
   * ```
   */
  rgb: (...rgb: RgbColor) => BrushStroke

  /**
   * Use RGB values to set background color.
   *
   * @example
   * ```ts
   * import { brush } from '@griseo.js/brush';
   * brush.bgRgb(222, 173, 237)('Hello, world!');
   * ```
   */
  bgRgb: (...rgb: RgbColor) => BrushStroke

  /**
   * Use HEX value to set text color.
   *
   * @param color - Hexadecimal value representing the desired color.
   *
   * @example
   * ```ts
   * import { brush } from '@griseo.js/brush';
   * brush.hex('#DEADED')('Hello, world!');
   * ```
   */
  hex: (hex: string) => BrushStroke

  /**
   * Use HEX value to set background color.
   *
   * @param color - Hexadecimal value representing the desired color.
   *
   * @example
   * ```ts
   * import { brush } from '@griseo.js/brush';
   * brush.bgHext('#DEADED')('Hello, world!');
   * ```
   */
  bgHex: (hex: string) => BrushStroke

  /**
   * Use an [8-bit unsigned number](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) to set text color.
   *
   * @example
   *
   * ```ts
   * import { brush } from '@griseo.js/brush';
   * brush.ansi256(201)('Hello, world!');
   * ```
   */
  ansi256: (code: number) => BrushStroke

  /**
   * Use an [8-bit unsigned number](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) to set background color.
   *
   * @example
   *
   * ```ts
   * import { brush } from '@griseo.js/brush';
   * brush.bgAnsi256(201)('Hello, world!');
   * ```
   */
  bgAnsi256: (code: number) => BrushStroke
}

/**
 * Miscellaneous brush strokes not associated with colors.
 */
type UtilityStrokes = {
  /**
   * Only prints the provided text if {@link Brush.level} is greater than 0.
   * Useful for things that are purely cosmetic.
   */
  visible: BrushStroke
}

/**
 * Translates a {@link ColorSupportLevel} to a {@link ColorType}.
 *
 * The {@link ColorType} is used to determine which wrapper function to use.
 *
 * @example {@link wrappers.color[ColorType]} or {@link wrappers.bgColor[ColorType]}
 */
const levelToColorType: Record<ColorSupportLevel, ColorSupport> = {
  0: 'ansi',
  1: 'ansi',
  2: 'ansi256',
  3: 'ansi16m',
}

/**
 * All color strokes supported by {@link TrueColorStrokes}.
 */
const trueColorStrokes: (keyof TrueColorStrokes)[] = [
  'rgb',
  'bgRgb',
  'hex',
  'bgHex',
  'ansi256',
  'bgAnsi256',
]

/**
 * Foreground color strokes supported by {@link TrueColorStrokes}.
 */
const foregroundTrueColorStrokes: (keyof TrueColorStrokes)[] = ['rgb', 'hex', 'ansi256']

/**
 * Helper function that coerces unknown arguments to a string.
 */
function argsToString(args: unknown[]): string {
  return args.length === 1 ? '' + args[0] : args.join(' ')
}

/**
 * Coerces a number of unknown arguments to an {@link RgbColor}.
 * - If a tuple of values, assume that an [r, g, b] tuple was passed.
 * - If a single value was passed, assume that it's a hex string / number and convert it.
 */
function argsToRgb(args: unknown[]): RgbColor {
  const rgb = args.length > 1 ? args : hexToRgb(args[0] ? '' + args[0] : '')
  return rgb as RgbColor
}

/**
 * Creates a noop function as a base object to define the {@link Brush} properties on.
 */
function createBrushPrototype(): Brush {
  return ((...args) => argsToString(args)) as Brush
}

/**
 * Creates a new function that passes itself as an argument to {@link paint} to apply styles.
 * Nested instances of {@link BrushStroke} derive properties from the parent, which is applied to {@link paint}.
 */
function createBrushStroke(): BrushStroke {
  const brushStroke = ((...args: unknown[]) => {
    return args.length ? paint(brushStroke, args) : brushStroke
  }) as BrushStroke
  return brushStroke
}

/**
 * Apply brush styles to a string.
 *
 * A {@link BrushStroke} can invoke this and pass itself as the second argument.
 */
function paint(brushStroke: BrushStroke, args: unknown[]): string {
  if (brushStroke.visibleOn && brushStroke.level <= 0) {
    return ''
  }

  const input = argsToString(args)

  if (brushStroke.level <= 0 || !input) {
    return '' + input
  }

  const { open, close } = brushStroke

  /**
   * If the input contains a closing tag, we need to close/open the tag to prevent it from being ignored.
   * @see https://github.com/lukeed/kleur/blob/master/colors.mjs#L19
   */
  const text = ~input.indexOf(close) ? input.replaceAll(close, close + open) : input

  const output = open + text + close

  /**
   * If the input contains a newline, we need to wrap each line in the open/close tags.
   * @see https://github.com/doowb/ansi-colors/blob/master/index.js#L34
   */
  return output.includes('\n') ? output.replaceAll(/\r*\n/g, `${close}$&${open}`) : output
}

/**
 * Create a new brush. Is NodeJS/browser agnostic and can't infer terminal color support.
 *
 * @internal
 */
export function createBrushInternal(options: Options = {}) {
  const brush = createBrushPrototype()

  brush.level = options.level ?? 0

  const properties: Record<string, PropertyDescriptor> = {
    level: {
      get() {
        return brush.level
      },
      set(level) {
        brush.level = level
      },
    },
    visible: {
      get() {
        const currentThis = this as BrushStroke

        const brushStroke = createBrushStroke()

        brushStroke.open = currentThis.open ?? ''
        brushStroke.close = currentThis.close ?? ''
        brushStroke.visibleOn = true

        Object.setPrototypeOf(brushStroke, prototype)
        Object.defineProperty(currentThis, 'visible', { value: brushStroke })

        return brushStroke
      },
    },
  }

  Object.entries(COLORS).forEach(([name, codes]) => {
    properties[name] = {
      get() {
        const currentThis = this as BrushStroke

        const brushStroke = createBrushStroke()

        const open = `\u001b[${codes[0]}m`
        const close = `\u001b[${codes[1]}m`

        brushStroke.open = currentThis.open ? currentThis.open + open : open
        brushStroke.close = currentThis.close ? close + currentThis.close : close
        brushStroke.visibleOn = currentThis.visibleOn

        Object.setPrototypeOf(brushStroke, prototype)
        Object.defineProperty(currentThis, name, { value: brushStroke })

        return brushStroke
      },
    }
  })

  trueColorStrokes.forEach((model) => {
    /**
     * Whether the foreground or background color is being set.
     */
    const wrapperType = foregroundTrueColorStrokes.includes(model) ? 'color' : 'bgColor'

    /**
     * The closing SGR code depends on whether a foreground or background color is being set.
     */
    const closingSgr = SGR_PARAMETERS[wrapperType === 'color' ? 'FG_DEFAULT' : 'BG_DEFAULT']

    properties[model] = {
      get() {
        return (...args: unknown[]) => {
          const currentThis = this as BrushStroke

          const colorType = levelToColorType[brush.level]

          const brushStroke = createBrushStroke()

          /**
           * To obtain the opening ANSI code:
           * - If ansi or bgAnsi, then forward to the ansi256 wrapper function.
           * - If hex or rgb, then forward the code or rgb tuple to the wrapper function,
           *   depending on what arguments the function needs.
           *
           * The hex or rgb wrapper function is determined by the current {@link Brush.level}
           */
          const open =
            model === 'ansi256' || model === 'bgAnsi256'
              ? wrappers[wrapperType].ansi256(args[0] as number)
              : colorType === 'ansi'
              ? wrappers[wrapperType].ansi(rgbToAnsi(...argsToRgb(args)))
              : colorType === 'ansi256'
              ? wrappers[wrapperType].ansi256(rgbToAnsi256(...argsToRgb(args)))
              : wrappers[wrapperType].ansi16m(...argsToRgb(args))

          const close = `\x1b[${closingSgr}m`

          brushStroke.open = currentThis.open ? currentThis.open + open : open
          brushStroke.close = currentThis.close ? close + currentThis.close : close
          brushStroke.visibleOn = currentThis.visibleOn

          Object.setPrototypeOf(brushStroke, prototype)
          Object.defineProperty(currentThis, model, { value: brushStroke })

          return brushStroke
        }
      },
    }
  })

  const prototype = Object.defineProperties(createBrushPrototype(), properties)
  Object.setPrototypeOf(brush, prototype)

  return brush
}
