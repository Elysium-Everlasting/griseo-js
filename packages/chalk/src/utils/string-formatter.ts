/**
 * A string formatter accepts a string and returns a string decorated with ansi-colors.
 */
export type Formatter = (text: string) => string

/**
 * Picocolors formatter.
 * @see https://github.com/alexeyraspopov/picocolors/blob/main/picocolors.js#L11
 */
export function createFormatter(open: string, close: string, replace = open): Formatter {
  return (input: unknown) => {
    const string = '' + input
    const index = string.indexOf(close, open.length)
    return ~index
      ? open + replaceClose(string, close, replace, index) + close
      : open + string + close
  }
}

/**
 * Picocolors replacement function.
 * @see https://github.com/alexeyraspopov/picocolors/blob/main/picocolors.js#L21
 */
export function replaceClose(
  string: string,
  close: string,
  replace: string,
  index: number,
): string {
  let start = string.substring(0, index) + replace
  let end = string.substring(index + close.length)
  let nextIndex = end.indexOf(close)
  return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end
}
