import { stdout, stderr } from '@griseo.js/palette/color-support/node'
import { _createBrush, type Options } from './brush.js'

/**
 * Create a new brush. Infer terminal color support in a NodeJS setting.
 */
export function createBrush(options: Options = {}) {
  options.level = options.level != null ? options.level : stdout ? stdout.level : 0
  return _createBrush(options)
}

export const brush = createBrush()
export const brushStderr = createBrush({ level: stderr ? stderr.level : 0 })

export * from './brush.js'
