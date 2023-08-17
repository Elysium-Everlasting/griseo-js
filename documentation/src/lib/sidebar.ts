import fs from 'node:fs'
import path from 'node:path'

import type { SidebarConfigArray } from 'vuepress'

function getStats(file: string): [string, fs.Stats] {
  return [file, fs.statSync(file)]
}

export function generateSidebar(directory: string, root = directory): SidebarConfigArray {
  const routes: SidebarConfigArray = fs
    .readdirSync(directory)
    .filter((file) => !file.startsWith('.'))
    .map((file) => getStats(path.join(directory, file)))
    .filter(([file]) => !path.basename(file).startsWith('index'))
    .flatMap(([file, stats]) => {
      const dir = path.relative(root, path.parse(file).dir)
      const name = path.parse(file).name

      const nameSegments = name.replace(/^\d*-/, '').split('-')

      /**
       * Capitalize all segments and rejoin with spaces.
       */
      const text = nameSegments
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ')

      return {
        text,
        link: '/' + (name.startsWith('index') ? dir : path.join(dir, name)),
        children: stats.isDirectory() ? generateSidebar(file, root) : [],
        collapsible: stats.isDirectory(),
      }
    })
  return routes
}
