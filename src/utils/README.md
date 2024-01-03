[< Back to Root](../../README.md)

# Utils

## Data Utils

```js
import { DataUtils } from '@yunibas/core'
const $data = new DataUtils()
```

### objectDiffs

Returns the differences of the first object from a second object.

```js
const a = { name: 'foo', num: 1 }
const b = { name: 'foo', num: 2 }
const diffs = $data.objectDiffs(a, b)
/*
 * diffs = { num: 1 }
 */
```

### getChangeDiffs

Returns the differences between two objects.

```js
const a = { name: 'foo', num: 1 }
const b = { name: 'foo', num: 2 }
const diffs = $data.getChangeDiffs(a, b)
/*
diffs = {
  before: { num: 1 },
  after: { num: 2 }
}
*/
```

## Error Utils

```js
import { ErrorUtils } from '@yunibas/core'
const $errorUtils = new ErrorUtils()
```

### errorHandler

```js
try {
  console.log(foo)
} catch (err) {
  throw $errorUtils.errorHandler(err)
}
```

## Transformation Utils

```js
import { TransformUtils } from '@yunibas/core'
const $transform = new TransformUtils()
```

### decodeFirestoreEvent

Used to decode a Firestore trigger event.

```js
const event = $transform.decodeFirestoreEvent(message)
```

### parsePubSubMessage

Used to parse JSON from PubSub event message.

```js
const event = $transform.parsePubSubMessage(message)
```

### parseUpdateDiff

Used to determine differences between new and old docs from Firestore update event.

```js
const event = $transform.decodeFirestoreEvent(message)
const diffs = $transform.parseUpdateDiff(event.value, event.oldValue)
```
