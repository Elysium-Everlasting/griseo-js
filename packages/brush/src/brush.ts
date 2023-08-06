import { COLORS, SGR_PARAMETERS } from '@griseo.js/palette/sgr'
import type { ColorSupportLevel } from '@griseo.js/palette/color-support'
import {
  wrappers,
  hexToRgb,
  rgbToAnsi,
  rgbToAnsi256,
  type RgbColor,
  type ColorSupport,
} from '@griseo.js/palette/ansi'

/**
 * Brush initialization options.
 */
export interface Options {
  /**
   * Explicitly set the desired color support for the brush.
   *
   * @see https://github.com/termstandard/colors
   *
   * @default
   * Automatically detected based on the environment,
   * depending on whether the NodeJS or browser version is used.
   *
   * Levels:
   * `0` - All colors disabled.
   * `1` - Basic 16 colors support.
   * `2` - ANSI 256 colors support.
   * `3` - Truecolor 16 million colors support.
   */
  level?: ColorSupportLevel
}

/**
 * Use a brush to beautifully color your terminal output!
 */
export type Brush = BrushState & BrushStroke

/**
 * Current state of the brush.
 */
type BrushState = {
  /**
   * Indicates the supported range of colors.
   *
   * @default Inferred based on the terminal environment when using a NodeJS or browser specific brush.
   */
  level: ColorSupportLevel
}

/**
 * Represents a nested instance of {@link Brush}.
 *
 * i.e. A string is formatted by applying brush strokes.
 */
interface BrushStroke extends ColorStrokes, TrueColorStrokes, UtilityStrokes, BrushState {
  /**
   * Like Kleur, invoking a {@link BrushStroke} without any arguments will return the {@link Brush} itself.
   *
   * @see https://github.com/lukeed/kleur/tree/master#chained-methods
   */
  (): Brush

  /**
   * Invoking a stroke with any number of arguments will return a formatted string.
   */
  (...args: unknown[]): string

  /**
   * The opening ANSI escape code for the stroke.
   *
   * When chaining, this can be multiple escape codes long; otherwise it's just one code.
   */
  open: string | undefined

  /**
   * The closing ANSI escape code for the stroke.
   *
   * When chaining, this can be multiple escape codes long; otherwise it's just one code.
   */
  close: string | undefined
}

/**
 * Miscellaneous brush strokes not associated with colors.
 */
type UtilityStrokes = {
  /**
   * Only prints the provided text if {@link Brush.level} is greater than 0.
   */
  visible: BrushStroke
}

/**
 * Brush strokes that apply predefined colors.
 */
type ColorStrokes = Record<keyof typeof COLORS, BrushStroke>

/**
 * Brush strokes that apply true colors.
 *
 * These differ from regular {@link ColorStrokes} because they need to be
 * initialized with the desired color to return a {@link BrushStroke}.
 */
type TrueColorStrokes = {
  rgb(...rgb: RgbColor): BrushStroke
  bgRgb(...rgb: RgbColor): BrushStroke
  hex(hex: string): BrushStroke
  bgHex(hex: string): BrushStroke
  ansi256(code: number): BrushStroke
  bgAnsi256(code: number): BrushStroke
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
 * The types of strokes supported by {@link TrueColorStrokes}.
 */
const trueColorStrokeTypes: (keyof TrueColorStrokes)[] = [
  'rgb',
  'bgRgb',
  'hex',
  'bgHex',
  'ansi256',
  'bgAnsi256',
]

/**
 * Helper function to coerce unknown arguments to a string.
 */
function argsToString(...args: unknown[]): string {
  return args.length === 1 ? '' + args[0] : args.join(' ')
}

/**
 * Create a noop function as a base object to define the {@link Brush} properties on.
 */
function createBrushPrototype(): Brush {
  return ((...args) => argsToString(...args)) as Brush
}

/**
 * Apply brush styles to a string.
 *
 * A {@link BrushStroke} can invoke this and pass itself as the second argument.
 */
function paint(brush: Brush, stroke: BrushStroke, args: unknown[]): string {
  let input = argsToString(...args)

  if (brush.level <= 0 || !input) {
    return '' + input
  }

  const { open, close } = stroke

  if (close != null && input.includes(close)) {
    input = input.replaceAll(close, close + open)
  }

  const output = open + input + close

  return output.includes('\n') ? output.replaceAll(/\r*\n/g, `${close}$&${open}`) : output
}

/**
 * Create a new brush. Is NodeJS/browser agnostic and can't infer terminal color support.
 *
 * @internal
 */
export function _createBrush(options: Options = {}) {
  const brush = createBrushPrototype()

  brush.level = options.level ?? 0

  const properties: Record<string, PropertyDescriptor> = {
    ...createColorPropertyDescriptors(),
    ...createTrueColorPropertyDescriptors(),
    level: {
      enumerable: true,
      get() {
        return brush.level
      },
      set(level) {
        brush.level = level
      },
    },
    visible: {
      enumerable: true,
      get() {
        const brushStroke = ((...args: unknown[]) => {
          return args.length ? argsToString(...args) : brushStroke
        }) as BrushStroke

        Object.setPrototypeOf(brushStroke, prototype)
        Object.defineProperty(this, 'visible', { value: brushStroke })

        return brushStroke
      },
    },
  }

  function createColorPropertyDescriptors(): Record<string, PropertyDescriptor> {
    const colorPropertyDescriptors = Object.entries(COLORS).reduce(
      (descriptors, [name, codes]) => {
        descriptors[name] = {
          get() {
            const currentThis = this as BrushStroke

            const brushStroke = ((...args: unknown[]) => {
              return args.length ? paint(brush, brushStroke, args) : brushStroke
            }) as BrushStroke

            const open = `\u001b[${codes[0]}m`
            const close = `\u001b[${codes[1]}m`

            brushStroke.open = currentThis.open ? currentThis.open + open : open
            brushStroke.close = currentThis.close ? close + currentThis.close : close

            Object.setPrototypeOf(brushStroke, prototype)
            Object.defineProperty(currentThis, name, { value: brushStroke })

            return brushStroke
          },
        }
        return descriptors
      },
      {} as Record<string, PropertyDescriptor>,
    )
    return colorPropertyDescriptors
  }

  function createTrueColorPropertyDescriptors(): Record<string, PropertyDescriptor> {
    const trueColorPropertyDescriptors = trueColorStrokeTypes.reduce(
      (descriptors, model) => {
        /**
         * Whether the foreground or background color is being set.
         */
        const wrapperType =
          model === 'rgb' || model === 'hex' || model === 'ansi256'
            ? ('color' as const)
            : ('bgColor' as const)

        /**
         * The closing SGR code depends on whether a foreground or background color is being set.
         */
        const closeSgr = SGR_PARAMETERS[wrapperType === 'color' ? 'FG_DEFAULT' : 'BG_DEFAULT']

        descriptors[model] = {
          get() {
            return (...args: any[]) => {
              const currentThis = this as BrushStroke

              /**
               * Needed for hex and rgb, but not for ansi. TODO: FIXME ?
               */
              const rgb = (args.length > 1 ? args : hexToRgb(args[0])) as RgbColor

              const colorType = levelToColorType[brush.level]

              const brushStroke = ((...args: unknown[]) => {
                return args.length ? paint(brush, brushStroke, args) : brushStroke
              }) as BrushStroke

              /**
               * To obtain the opening ANSI code:
               *
               * - If ansi or bgAnsi, then forward to the ansi256 wrapper function.
               * - If hex or rgb, then forward the code or rgb tuple to the wrapper function,
               *   depending on what arguments the function needs.
               *
               * The hex or rgb wrapper function is determined by the current {@link Brush.level}
               */
              const open =
                model === 'ansi256' || model === 'bgAnsi256'
                  ? wrappers[wrapperType].ansi256(args[0])
                  : colorType === 'ansi'
                  ? wrappers[wrapperType][colorType](rgbToAnsi(...rgb))
                  : colorType === 'ansi256'
                  ? wrappers[wrapperType][colorType](rgbToAnsi256(...rgb))
                  : wrappers[wrapperType][colorType](...rgb)

              const close = `\x1b[${closeSgr}m`

              brushStroke.open = currentThis.open ? currentThis.open + open : open
              brushStroke.close = currentThis.close ? close + currentThis.close : close

              Object.setPrototypeOf(brushStroke, prototype)
              Object.defineProperty(currentThis, model, { value: brushStroke })

              return brushStroke
            }
          },
        }

        return descriptors
      },
      {} as Record<string, PropertyDescriptor>,
    )

    return trueColorPropertyDescriptors
  }

  const prototype = Object.defineProperties(createBrushPrototype(), properties)
  Object.setPrototypeOf(brush, prototype)

  return brush
}
