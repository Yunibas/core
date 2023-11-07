[< Back to Root](../../README.md)

# Utils

## Transformation Utils

```js
import { TransformUtils } from '@yunibas/core'
const transform = new TransformUtils()
```

### parsePubSubMessage

Used to parse JSON from PubSub event message.

```js
const event = transform.parsePubSubMessage(message)
```
