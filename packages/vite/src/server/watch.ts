import glob from 'fast-glob'
import type { WatchOptions } from 'chokidar'
import type { ResolvedConfig } from './config'

const gitDirectory = '.git'
const nodeModulesDirectory = 'node_modules'
const playwrightResultsDirectory = 'test-results'

const defaultIgnoredDirectories = [gitDirectory, nodeModulesDirectory, playwrightResultsDirectory]

export function resolveChokidarOptions(
  config: ResolvedConfig,
  options: WatchOptions = {},
): WatchOptions {
  const { ignored = [], ...otherOptions } = options

  const resolvedChokidarOptions: WatchOptions = {
    ignored: [
      /**
       * Ignore all nested content from {@link defaultIgnoredDirectories}
       */
      ...defaultIgnoredDirectories.map((directory) => `**/${directory}/**`),

      /**
       * Ignore the designated cache directory, with the correct escaping.
       */
      glob.escapePath(config.cacheDir) + '/**',

      /**
       * Ignore any specific ignored files.
       */
      ...(Array.isArray(ignored) ? ignored : [ignored]),
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ...otherOptions,
  }

  return resolvedChokidarOptions
}
