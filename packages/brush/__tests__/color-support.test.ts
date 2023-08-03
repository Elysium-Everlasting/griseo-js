import { describe, test, expect } from 'vitest'
import { brush } from '../src/index.js'

/**
 * TODO: Do this when ESM supports loader hooks
 * Spoof supports-color
 *
 * ```ts
 * require('./_supports-color')(__dirname, {
 *  stdout: {
 *    level: 0,
 *    hasBasic: false,
 *    has256: false,
 *    has16m: false
 *  },
 *  stderr: {
 *    level: 0,
 *    hasBasic: false,
 *    has256: false,
 *    has16m: false
 *  }
 * });
 */

describe('color support', () => {
  test('colors can be forced by using chalk.level', () => {
    brush.level = 1
    expect(brush.green('hello')).toBe('\u001B[32mhello\u001B[39m')
  })
})
