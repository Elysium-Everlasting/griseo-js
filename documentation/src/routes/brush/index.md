---
title: Brush

next:
  text: Getting Started
  link: /brush/0-getting-started
---

# Brush

#### A brush to paint beautifully formatted strings :paintbrush:

<div class="my-4 flex justify-center">
  <img src="/images/brush.png" height="250" />
</div>

```ts twoslash
interface IdLabel {
  id: number /* some fields */
}
interface NameLabel {
  name: string /* other fields */
}
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw 'unimplemented'
}

let a = createLabel('typescript')
```
