import type { ColorSupport, ColorSupportLevel } from './index.js'

/**
 * Detect the color support level of the current browser.
 */
function detectColorSupportLevel(): ColorSupportLevel {
  if (navigator.userAgentData) {
    const brand = navigator.userAgentData.brands.find(({ brand }) => brand === 'Chromium')
    if (Number(brand?.version) > 93) {
      return 3
    }
  }

  if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
    return 1
  }

  return 0
}

const level = detectColorSupportLevel()

const colorSupport: false | ColorSupport = level !== 0 && {
  level,
  hasBasic: true,
  has256: level >= 2,
  has16m: level >= 3,
}

export const supportsColor = {
  stdout: colorSupport,
  stderr: colorSupport,
}

export default supportsColor
