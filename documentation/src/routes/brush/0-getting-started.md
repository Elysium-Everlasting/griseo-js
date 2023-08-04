---
title: Getting Started

prev:
  text: Introduction
  link: /brush

next:
  text: Comparison
  link: /brush/1-comparison
---

# Getting Started

[[toc]]

## Installation

:::: code-group

::: code-group-item npm

```sh
npm install @griseo-js/brush
```

:::

::: code-group-item yarn

```sh
yarn add @griseo-js/brush
```

:::

::: code-group-item pnpm

```sh
pnpm add @griseo-js/brush
```

:::

::::

## Usage

### Chalk Syntax

```ts
import { brush } from '@griseo-js/brush'

console.log(chalk.blue('Hello world!'))
```

:::tip
Just like Chalk, `@griseo-js/brush` comes with an easy to use,
composable API that allows you to chain and/or nest all the styles you want.
:::

```ts
import { brush } from '@griseo-js/brush'

// Combine styled and normal strings
console.log(brush.blue('Hello') + ' World' + brush.red('!'))

// Compose multiple styles using the chainable API
console.log(brush.blue.bgRed.bold('Hello world!'))

// Pass in multiple arguments
console.log(brush.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'))

// Nest styles
console.log(brush.red('Hello', brush.underline.bgBlue('world') + '!'))

// Nest styles of the same type even (color, underline, background)
console.log(
  brush.green(
    'I am a green line ' +
      brush.blue.underline.bold('with a blue substring') +
      ' that becomes green again!',
  ),
)

// ES2015 template literal
console.log(`
CPU: ${brush.red('90%')}
RAM: ${brush.green('40%')}
DISK: ${brush.yellow('70%')}
`)

// Use RGB colors in terminal emulators that support it.
console.log(brush.rgb(123, 45, 67).underline('Underlined reddish color'))
console.log(brush.hex('#DEADED').bold('Bold gray!'))
```

:::tip
Easily define your own themes for printing messages!
:::

```ts
import { brush } from '@griseo-js/brush'

const error = brush.bold.red
const warning = brush.hex('#FFA500') // Orange color

console.log(error('Error!'))
console.log(warning('Warning!'))
```

:::tip
Take advantage of `console.log` [string substitution](https://nodejs.org/docs/latest/api/console.html#console_console_log_data_args):
:::

```ts
import chalk from 'chalk'

const name = 'Sindre'
console.log(chalk.green('Hello %s'), name)
//=> 'Hello Sindre'
```

### Kleur Syntax

```ts
import { brush } from '@griseo-js/brush'

// basic usage
brush.red('red text')

// chained methods
brush.blue().bold().underline('howdy partner')

// nested methods
brush.bold(`${white().bgRed('[ERROR]')} ${brush.red().italic('Something happened')}`)
```

#### Chained Methods

```ts
import { brush } from '@griseo-js/brush'

const { bold, red } = brush

console.log(bold().red('this is a bold red message'))
console.log(bold().italic('this is a bold italicized message'))
console.log(bold().yellow().bgRed().italic('this is a bold yellow italicized message'))
console.log(green().bold().underline('this is a bold green underlined message'))
```

#### Nested Methods

```ts
import { brush } from '@griseo-js/brush'

const { yellow, red, cyan } = brush

console.log(yellow(`foo ${red().bold('red')} bar ${cyan('cyan')} baz`))
console.log(yellow('foo ' + red().bold('red') + ' bar ' + cyan('cyan') + ' baz'))
```
