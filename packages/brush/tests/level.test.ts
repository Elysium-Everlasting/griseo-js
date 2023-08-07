import { describe, test, expect } from 'vitest'
import { createBrush } from '../src/index.js'

describe('level', () => {
  test("don't output colors when manually disabled", () => {
    const chalk = createBrush({ level: 1 })

    chalk.level = 0

    expect(chalk.red('foo')).toBe('foo')
  })

  test('enable/disable colors based on overall chalk .level property, not individual instances', () => {
    const chalk = createBrush({ level: 1 })

    chalk.level = 1
    const { red } = chalk

    expect(red.level).toBe(1)

    chalk.level = 0
    expect(red.level).toBe(chalk.level)
  })

  test('propagate enable/disable changes from child colors', () => {
    const chalk = createBrush({ level: 1 })

    chalk.level = 1

    const { red } = chalk

    expect(red.level).toBe(1)
    expect(chalk.level).toBe(1)

    red.level = 0

    expect(red.level).toBe(0)
    expect(chalk.level).toBe(0)

    chalk.level = 1

    expect(red.level).toBe(1)
    expect(chalk.level).toBe(1)
  })

  // test('disable colors if they are not supported', async () => {
  //   const { stdout } = await execaNode(url.fileURLToPath(new URL('_fixture.js', import.meta.url)));
  //   expect(stdout).toBe('testout testerr');
  // });
})
