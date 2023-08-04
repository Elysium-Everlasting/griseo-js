import fs from 'node:fs'
import path from 'node:path'
import { findAllProjects, getWorkspaceRoot } from './projects.js'

export interface Library {
  name: string
  description: string
  href: string
}

export function getLibraries(): Library[] {
  const projects = findAllProjects(path.resolve(getWorkspaceRoot(), 'packages'))

  const libraries: Library[] = projects
    .filter((project) => fs.existsSync(path.resolve(project, 'package.json')))
    .map((project) => {
      try {
        const library: Library = JSON.parse(
          fs.readFileSync(path.resolve(project, 'package.json'), 'utf-8'),
        )
        return library
      } catch {
        const library = {
          name: path.basename(project),
          description: '',
        } as Library
        return library
      }
    })
    .map((library) => {
      /**
       * If the name is in the form, '@griseo-js/<package name>', remove the '@griseo-js/' part.
       */
      if (library.name.includes('/')) {
        library.name = library.name.split('/').pop() ?? ''
      }

      /**
       * href is just the lowercase name.
       */
      library.href = `/${library.name}`

      /**
       * Capitalize the first letter of the name.
       */
      library.name = library.name.charAt(0).toUpperCase() + library.name.slice(1)
      return library
    })

  return libraries
}
