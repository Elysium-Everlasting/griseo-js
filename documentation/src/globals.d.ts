import type { Library } from './lib/library.js'

declare global {
  var __libraries__: Library[]
}
