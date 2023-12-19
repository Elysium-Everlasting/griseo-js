import { stdout, stderr } from '@griseo.js/palette/color-support/node'

import { createBrushInternal, type Options } from './brush.js'

/**
 * Create a new brush. Infer terminal color support in a Node.js environment.
 */
export function createBrush(options: Options = {}) {
  options.level = options.level != null ? options.level : stdout ? stdout.level : 0
  return createBrushInternal(options)
}

export const brush = createBrush()

export const brushStderr = createBrush({ level: stderr ? stderr.level : 0 })

export { stdout as supportsColor, stderr as supportsColorStderr }

export * from './brush.js'

export default brush
