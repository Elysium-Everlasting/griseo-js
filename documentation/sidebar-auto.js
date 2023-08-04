import fs from 'node:fs'
import path from 'node:path'

/**
 * @param {string} file
 * @returns {[string, fs.Stats]}
 */
function getStats(file) {
  return [file, fs.statSync(file)]
}

/**
 * @param {string} directory
 * @returns {import('vuepress').SidebarConfigArray}
 *
 */
function getSubRoutes(directory, root = directory) {
  /**
   * @type {import('vuepress').SidebarConfigArray}
   */
  const routes = fs
    .readdirSync(directory)
    .filter((file) => !file.startsWith('.'))
    .map((file) => getStats(path.join(directory, file)))
    .filter(([file]) => !path.basename(file).startsWith('index'))
    .flatMap(([file, stats]) => {
      const dir = path.relative(root, path.parse(file).dir)
      const name = path.parse(file).name
      return {
        text: path.basename(file).charAt(0).toUpperCase() + path.parse(file).name.slice(1),
        link: '/' + (name.startsWith('index') ? dir : path.join(dir, name)),
        children: stats.isDirectory() ? getRoutes(file, root) : [],
        collapsible: stats.isDirectory(),
      }
    })
  return routes
}

/**
 * @param {string} directory
 * @returns {import('vuepress').SidebarConfigArray}
 *
 */
function getRoutes(directory, root = directory) {
  /**
   * @type {import('vuepress').SidebarConfigArray}
   */
  const routes = fs
    .readdirSync(directory)
    .filter((file) => !file.startsWith('.'))
    .map((file) => getStats(path.join(directory, file)))
    .filter(([file]) => !path.basename(file).startsWith('index'))
    .flatMap(([file, stats]) => {
      const dir = path.relative(root, path.parse(file).dir)
      const name = path.parse(file).name
      return {
        text: path.basename(file).charAt(0).toUpperCase() + path.parse(file).name.slice(1),
        link: '/' + (name.startsWith('index') ? dir : path.join(dir, name)),
        children: stats.isDirectory() ? getSubRoutes(file, root) : [],
        collapsible: stats.isDirectory(),
      }
    })
  return routes
}

async function main() {
  const routes = getRoutes('./src/routes')
  console.log(JSON.stringify(routes, null, 2))
}

main()
