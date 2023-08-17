import os from 'node:os'
import process from 'node:process'
import tty from 'node:tty'

import type { ColorSupport, ColorSupportLevel } from './index.js'

const CI_VENDORS = ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE']

const enableColorFlags = ['no-color', 'no-colors', 'color=false', 'color=never']
const disableColorFlags = ['color', 'colors', 'color=true', 'color=always']

let flagForceColor: ColorSupportLevel | undefined = disableColorFlags.some((flag) => hasFlag(flag))
  ? 0
  : enableColorFlags.some((flag) => hasFlag(flag))
  ? 1
  : undefined

/**
 * @see https://github.com/sindresorhus/has-flag/blob/main/index.js#L3
 */
function hasFlag(flag: string, argv = process.argv): boolean {
  const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--'
  const position = argv.indexOf(prefix + flag)
  const terminatorPosition = argv.indexOf('--')
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition)
}

function envForceColor(): ColorSupportLevel | undefined {
  if ('FORCE_COLOR' in process.env) {
    if (process.env['FORCE_COLOR'] === 'true') {
      return 1
    }

    if (process.env['FORCE_COLOR'] === 'false') {
      return 0
    }

    return process.env['FORCE_COLOR']?.length === 0
      ? 1
      : (Math.min(parseInt(process.env['FORCE_COLOR'] ?? '', 10), 3) as ColorSupportLevel)
  }

  return undefined
}

function translateLevel(level: ColorSupportLevel): false | ColorSupport {
  if (level === 0) {
    return false
  }

  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  }
}

/**
 * Idk.
 */
export interface DetectOptions extends Options {
  /**
   * Whether the terminal is a TTY instead of a dumb terminal.
   */
  streamIsTTY?: boolean
}

/**
 * @internal
 */
function detectColorSupportLevel(
  stream?: Partial<tty.WriteStream>,
  options: DetectOptions = {},
): ColorSupportLevel {
  const noFlagForceColor = envForceColor()

  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor
  }

  const forceColor = options.sniffFlags ? flagForceColor : noFlagForceColor

  if (forceColor === 0) {
    return 0
  }

  if (options.sniffFlags ?? true) {
    if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
      return 3
    }

    if (hasFlag('color=256')) {
      return 2
    }
  }

  // Check for Azure DevOps pipelines.
  // Has to be above the `!streamIsTTY` check.
  if ('TF_BUILD' in process.env && 'AGENT_NAME' in process.env) {
    return 1
  }

  if (stream && !options.streamIsTTY && forceColor === undefined) {
    return 0
  }

  const min = forceColor ?? 0

  if (process.env['TERM'] === 'dumb') {
    return min
  }

  if (process.platform === 'win32') {
    // Windows 10 build 10586 is the first Windows release that supports 256 colors.
    // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
    const osRelease = os.release().split('.')

    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10_586) {
      return Number(osRelease[2]) >= 14_931 ? 3 : 2
    }

    return 1
  }

  if ('CI' in process.env) {
    if ('GITHUB_ACTIONS' in process.env || 'GITEA_ACTIONS' in process.env) {
      return 3
    }

    if (
      CI_VENDORS.some((vendor) => vendor in process.env) ||
      process.env['CI_NAME'] === 'codeship'
    ) {
      return 1
    }

    return min
  }

  if ('TEAMCITY_VERSION' in process.env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(process.env['TEAMCITY_VERSION'] ?? '') ? 1 : 0
  }

  if (process.env['COLORTERM'] === 'truecolor') {
    return 3
  }

  if (process.env['TERM'] === 'xterm-kitty') {
    return 3
  }

  if ('TERM_PROGRAM' in process.env) {
    const version = parseInt((process.env['TERM_PROGRAM_VERSION'] ?? '').split('.')[0] ?? '', 10)

    switch (process.env['TERM_PROGRAM']) {
      case 'iTerm.app': {
        return version >= 3 ? 3 : 2
      }

      case 'Apple_Terminal': {
        return 2
      }

      // No default
    }
  }

  if (/-256(color)?$/i.test(process.env['TERM'] ?? '')) {
    return 2
  }

  if (
    /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(process.env['TERM'] ?? '')
  ) {
    return 1
  }

  if ('COLORTERM' in process.env) {
    return 1
  }

  return min
}

/**
 * Idk.
 */
export interface Options {
  /**
   * Whether to parse flags?
   *
   * @default true
   */
  sniffFlags?: boolean
}

export function createColorSupport(
  stream?: Partial<tty.WriteStream>,
  options: Options = {},
): false | ColorSupport {
  const level = detectColorSupportLevel(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options,
  })
  return translateLevel(level)
}

export const stdout = createColorSupport({ isTTY: tty.isatty(1) })

export const stderr = createColorSupport({ isTTY: tty.isatty(2) })

export const supportsColor = { stdout, stderr }

export default supportsColor

export * from './index.js'
