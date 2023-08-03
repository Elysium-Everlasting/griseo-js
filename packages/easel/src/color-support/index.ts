/**
 * Levels:
 * - `0` - All colors disabled.
 * - `1` - Basic 16 colors support.
 * - `2` - ANSI 256 colors support.
 * - `3` - Truecolor 16 million colors support.
 */
export type ColorSupportLevel = 0 | 1 | 2 | 3

/**
 * Describes the color support of an environment.
 */
export type ColorSupport = {
  /**
   * The color level.
   */
  level: ColorSupportLevel

  /**
   * Whether basic 16 colors are supported.
   */
  hasBasic: boolean

  /**
   * Whether ANSI 256 colors are supported.
   */
  has256: boolean

  /**
   * Whether Truecolor 16 million colors are supported.
   */
  has16m: boolean
}
