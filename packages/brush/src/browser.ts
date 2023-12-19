import { stdout, stderr } from '@griseo.js/palette/color-support/browser'

import { createBrushInternal, type Options } from './brush.js'

/**
 * Create a new brush. Infer terminal color support in a browser environment.
 */
export function createBrush(options: Options = {}) {
  options.level = options.level != null ? options.level : stdout ? stdout.level : 0
  return createBrushInternal(options)
}

export const brush = createBrush()

export const brushStderr = createBrush({ level: stderr ? stderr.level : 0 })

export { stdout as supportsColor, stderr as supportsColorStderr }

export default brush

export * from './brush.js'
