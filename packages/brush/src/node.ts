import { COLORS, SGR_PARAMETERS } from '@griseo-js/easel/sgr'
import {
  stderr as stderrColor,
  stdout as stdoutColor,
  type ColorSupportLevel,
} from '@griseo-js/easel/color-support/node'
import {
  wrappers,
  hexToRgb,
  rgbToAnsi,
  rgbToAnsi256,
  type RgbColor,
  type ColorType,
} from '@griseo-js/easel/ansi'

/**
 * Options!
 */
export interface Options {
  /**
   * Specify the color support for Chalk.
   * By default, color support is automatically detected based on the environment.
   * Levels:
   *  - `0` - All colors disabled.
   *  - `1` - Basic 16 colors support.
   *  - `2` - ANSI 256 colors support.
   *  - `3` - True color 16 million colors support.
   */
  level?: ColorSupportLevel
}

/**
 * Chalk!
 */
export type Chalk = Metadata & ChalkBuilder & TrueColorBuilders & Metadata

/**
 * Metadata!
 */
type Metadata = {
  level: ColorSupportLevel
}

/**
 * Builder!
 */
interface ChalkBuilder extends ColorBuilders, TrueColorBuilders, UtilityBuilders, Metadata {
  (): Chalk
  (...args: unknown[]): string
}

/**
 * Utility!
 */
type UtilityBuilders = {
  visible: ChalkBuilder
}

/**
 * Colors!
 */
type ColorBuilders = Record<keyof typeof COLORS, ChalkBuilder>

/**
 * True color!
 */
type TrueColorBuilders = {
  rgb(...rgb: RgbColor): ChalkBuilder
  bgRgb(...rgb: RgbColor): ChalkBuilder
  hex(hex: string): ChalkBuilder
  bgHex(hex: string): ChalkBuilder
  ansi256(code: number): ChalkBuilder
  bgAnsi256(code: number): ChalkBuilder
}

/**
 * Builder!
 * @internal
 */
type Builder = ChalkBuilder & {
  open: string
  close: string
}

/**
 * Translates a {@link ColorSupportLevel} to a {@link ColorType}.
 */
const levelToColorType = {
  0: 'ansi',
  1: 'ansi',
  2: 'ansi256',
  3: 'ansi16m',
} as const satisfies Record<ColorSupportLevel, ColorType>

/**
 * Additional true color models.
 */
const trueColorModels = ['rgb', 'bgRgb', 'hex', 'bgHex', 'ansi256', 'bgAnsi256'] as const

const argsToString = (...args: unknown[]): string =>
  args.length === 1 ? '' + args[0] : args.join(' ')

const MIN_LEVEL: ColorSupportLevel = 0
const MAX_LEVEL: ColorSupportLevel = 3

/**
 * Style!
 */
function style(chalk: Chalk, builder: Builder, args: unknown[]): string {
  let input = argsToString(...args)

  if (chalk.level <= 0 || !input) {
    return '' + input
  }

  const { open, close } = builder

  if (close != null && input.includes(close)) {
    input = input.replaceAll(close, close + open)
  }

  const output = open + input + close

  return output.includes('\n') ? output.replaceAll(/\r*\n/g, `${close}$&${open}`) : output
}

/**
 * Create!
 */
export function createChalk(options: Options = {}) {
  if (
    options.level != null &&
    !(Number.isInteger(options.level) && options.level >= MIN_LEVEL && options.level <= MAX_LEVEL)
  ) {
    throw new Error('The `level` option should be an integer from 0 to 3')
  }

  const chalk = ((...args) => (args.length === 1 ? '' + args[0] : args.join(' '))) as Chalk

  chalk.level = options.level != null ? options.level : stdoutColor ? stdoutColor.level : 0

  /**
   * Properties!
   */
  const properties: Record<string, PropertyDescriptor> = {
    ...createColorPropertyDescriptors(),
    ...createTrueColorPropertyDescriptors(),
    level: {
      enumerable: true,
      get() {
        return chalk.level
      },
      set(level) {
        chalk.level = level
      },
    },
    visible: {
      enumerable: true,
      get() {
        const builder = ((...args: unknown[]) =>
          args.length ? argsToString(...args) : builder) as Builder

        Object.setPrototypeOf(builder, prototype)
        Object.defineProperty(this, 'visible', { value: builder })

        return builder
      },
    },
  }

  /**
   * Prototype!
   */
  const prototype = Object.defineProperties(() => {}, properties)

  /**
   * Create!
   */
  function createColorPropertyDescriptors(): Record<string, PropertyDescriptor> {
    const colorPropertyDescriptors = Object.entries(COLORS).reduce(
      (descriptors, [name, codes]) => {
        descriptors[name] = {
          get() {
            const currentThis = this as Builder

            const builder = ((...args: unknown[]) => {
              return args.length ? style(chalk, builder, args) : builder
            }) as Builder

            const open = `\u001b[${codes[0]}m`
            const close = `\u001b[${codes[1]}m`

            builder.open = currentThis.open ? currentThis.open + open : open
            builder.close = currentThis.close ? close + currentThis.close : close

            Object.setPrototypeOf(builder, prototype)
            Object.defineProperty(this, name, { value: builder })

            return builder
          },
        }
        return descriptors
      },
      {} as Record<string, PropertyDescriptor>,
    )
    return colorPropertyDescriptors
  }

  /**
   * Create!
   */
  function createTrueColorPropertyDescriptors(): Record<string, PropertyDescriptor> {
    const trueColorPropertyDescriptors = trueColorModels.reduce(
      (descriptors, model) => {
        const wrapperType =
          model === 'rgb' || model === 'hex' || model === 'ansi256'
            ? ('color' as const)
            : ('bgColor' as const)

        const closeSgr =
          wrapperType === 'color' ? SGR_PARAMETERS.FG_DEFAULT : SGR_PARAMETERS.BG_DEFAULT

        descriptors[model] = {
          get() {
            return (...args: any[]) => {
              const currentThis = this as Builder

              /**
               * Needed for hex and rgb, but not for ansi. TODO: FIXME ?
               */
              const rgb = (args.length > 1 ? args : hexToRgb(args[0])) as RgbColor

              const colorType = levelToColorType[chalk.level]

              const builder = ((...args: unknown[]) => {
                return args.length ? style(chalk, builder, args) : builder
              }) as Builder

              /**
               * Logic:
               * - If ansi or bgAnsi, then forward all arguments as-is to the ansi256 wrapper function.
               * - If hex or rgb, then forward the rgb values (tuple) to the wrapper function.
               */
              const open =
                model === 'ansi256' || model === 'bgAnsi256'
                  ? wrappers[wrapperType].ansi256(...args)
                  : colorType === 'ansi'
                  ? wrappers[wrapperType][colorType](rgbToAnsi(...rgb))
                  : colorType === 'ansi16m'
                  ? wrappers[wrapperType][colorType](...rgb)
                  : wrappers[wrapperType][colorType](rgbToAnsi256(...rgb))

              const close = `\x1b[${closeSgr}m`

              builder.open = currentThis.open ? currentThis.open + open : open
              builder.close = currentThis.close ? close + currentThis.close : close

              Object.setPrototypeOf(builder, prototype)
              Object.defineProperty(this, model, { value: builder })

              return builder
            }
          },
        }

        return descriptors
      },
      {} as Record<string, PropertyDescriptor>,
    )

    return trueColorPropertyDescriptors
  }

  Object.setPrototypeOf(chalk, prototype)
  return chalk
}

export const chalk = createChalk()
export const chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 })
