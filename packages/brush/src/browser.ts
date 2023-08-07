import { stdout, stderr } from '@griseo.js/palette/color-support/browser'
import { _createBrush, type Options } from './brush.js'

/**
 * Create a new brush. Infer terminal color support in a browser setting.
 */
export function createBrush(options: Options = {}) {
  options.level = options.level != null ? options.level : stdout ? stdout.level : 0
  return _createBrush(options)
}

export const brush = createBrush()

export const brushStderr = createBrush({ level: stderr ? stderr.level : 0 })

export * from './brush.js'

export { stdout as supportsColor, stderr as supportsColorStderr }

export default brush
