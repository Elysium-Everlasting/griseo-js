import path from 'node:path'
import url from 'node:url'
import { version } from '../../package.json'
import { getClosestProjectDirectory } from '../utils/project.js'

/**
 * The current version of the package. Locked in during build time.
 */
export const VERSION = version

/**
 * Idk.
 */
export const MAIN_FIELDS = [
  'module',
  'jsnext:main', // moment.js still uses this
  'main',
]

/**
 * Baseline support browsers list.
 *
 * "defaults and supports es6-module and supports es6-module-dynamic-import"
 *
 * Higher browser versions may be needed for extra features.
 */
export const ESBUILD_MODULES_TARGET = [
  'es2020', // supports `import.meta.url`
  'edge88',
  'firefox78',
  'chrome87',
  'safari14',
]

/**
 * Recognized JS/TS file extensions, including their CommonJS/ESM specific variants.
 */
export const JS_EXTENSIONS = ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts']

/**
 * Recognized JSX/TSX file extensions.
 */
export const JSX_EXTENSIONS = ['.jsx', '.tsx']

/**
 * Not sure what these extra extensions are for.
 */
export const EXTENSIONS = [...JS_EXTENSIONS, ...JSX_EXTENSIONS, '.json']

export const CSS_EXTENSIONS = [
  '.css',
  '.less',
  '.sass',
  '.scss',
  '.styl',
  '.stylus',
  '.pcss',
  '.postcss',
  '.sss',
]

export const SPECIAL_IMPORT_SUFFIXES = ['worker', 'sharedworker', 'raw', 'url']

/**
 * The name of the config file used (excluding file extension).
 * It must be a recognized JS or TS file.
 */
export const CONFIG_FILE_NAME = 'vite.config'

/**
 * Accepted config file names, including their extensions.
 */
export const CONFIG_FILES = JS_EXTENSIONS.map((extension) => `${CONFIG_FILE_NAME}${extension}`)

/**
 * JS/TS file extensions.
 */
export const JS_MODULE_REGEX = new RegExp(`\\.(${JS_EXTENSIONS.join('|')})(?:$|\\?)`)

/**
 * JSX/TSX file extensions.
 */
export const JSX_MODULE_REGEX = new RegExp(`\\.(${JSX_EXTENSIONS.join('|')})(?:$|\\?)`)

/**
 * CSS/preprocessor file extensions.
 */
export const CSS_MODULE_REGEX = new RegExp(`\\.(${CSS_EXTENSIONS.join('|')})(?:$|\\?)`)

/**
 * Files can be imported with a special query string to indicate custom handling logic.
 * @see https://vitejs.dev/guide/assets.html#importing-asset-as-string
 */
export const SPECIAL_IMPORT_REGEX = new RegExp(`[?&](?:${SPECIAL_IMPORT_SUFFIXES.join('|')})\\b`)

/**
 * Prefix for resolved fs paths, since Windows paths may not be valid URLs (e.g. `C:\`).
 */
export const FS_PREFIX = `/@fs/`

/**
 * Prefix for resolved IDs that are not valid browser import specifiers.
 */
export const ID_PREFIX = `/@id/`

/**
 * Plugins that use 'virtual modules' (e.g. for helper functions),
 * should prefix the module ID with `\0` to indicate that it is not a real file.
 *
 * @see https://rollupjs.org/plugin-development/#conventions
 *
 * This prevents other plugins from attempting to process the ID (like Node resolution),
 * and core features like sourcemaps can use this information to distinguish between
 * virtual modules and real files.
 *
 * `\0` is not a valid character in a file path, so we have to replace them during import analysis
 * and decoded back before entering the plugins pipeline.
 *
 * These encoded virtual IDs are also prefixed by the {@link ID_PREFIX},
 * so virtual modules in the browser end up encoded as `/@id/${ID_PREFIX}${ID}`.
 */
export const NULL_BYTE_PLACEHOLDER = `__x00__`

/**
 * Idk.
 */
export const CLIENT_PUBLIC_PATH = `/@vite/client`

/**
 * Idk.
 */
export const ENV_PUBLIC_PATH = `/@vite/env`

/**
 * This package's project/root directory.
 */
export const VITE_PROJECT_DIRECTORY = getClosestProjectDirectory(url.fileURLToPath(import.meta.url))

/**
 * Idk.
 */
export const CLIENT_ENTRY = path.resolve(VITE_PROJECT_DIRECTORY, 'dist/client/client.mjs')

/**
 * Idk.
 */
export const ENV_ENTRY = path.resolve(VITE_PROJECT_DIRECTORY, 'dist/client/env.mjs')

/**
 * Idk.
 */
export const CLIENT_DIRECTORY = path.dirname(CLIENT_ENTRY)

/**
 * ___READ THIS___ before editing {@link KNOWN_ASSET_TYPES}.
 *
 * If you add an asset to {@link KNOWN_ASSET_TYPES}, please ensure to do the following:
 *
 * 1. Add it to the TypeScript declaration file `packages/vite/client.d.ts`
 * 2. Add a mime type to the `registerCustomMime` in `packages/vite/src/node/plugin/assets.ts`
 *    if this mime type cannot be looked up by mrmime.
 */
export const KNOWN_ASSET_TYPES = [
  // images
  'apng',
  'png',
  'jpe?g',
  'jfif',
  'pjpeg',
  'pjp',
  'gif',
  'svg',
  'ico',
  'webp',
  'avif',

  // media
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'flac',
  'aac',
  'opus',

  // fonts
  'woff2?',
  'eot',
  'ttf',
  'otf',

  // other
  'webmanifest',
  'pdf',
  'txt',
]

/**
 * Regex for matching known asset files.
 */
export const DEFAULT_ASSETS_REGEX = new RegExp(`\\.(${KNOWN_ASSET_TYPES.join('|')})(\\?.*)?$`)

/**
 * Idk.
 */
export const DEPENDENCY_VERSION_REGEX = /[?&](v=[\w.-]+)\b/

/**
 * Idk.
 */
export const LOOPBACK_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '0000:0000:0000:0000:0000:0000:0000:0001',
])

/**
 * Idk, probably for development server?
 */
export const WILDCARD_HOSTS = new Set(['0.0.0.0', '::', '0000:0000:0000:0000:0000:0000:0000:0000'])
