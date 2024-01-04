[< Back to Google Cloud Adapters](../README.md)

# PubSub Adapter

The PubSub Adapter is used to manage topics and post messages to the GCP PubSub service.

```js
const { PubSubAdapter } = require('@yunibas/core')
const $pubsub = new PubSubAdapter()
```

## Manage PubSub

These calls manage PubSub topics.

### createTopic

Creates a PubSub topic.

Returns true on success.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| name     | Y     | Name of topic to be created                  |

```js
const result = await $pubsub.createTopic('FooTopic')
```

### getTopics

Returns all PubSub topics.


```js
const result = await $pubsub.getTopics()
```

### getTopic

Return a PubSub topic.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| name     | Y     | Name of topic to retrieve                  |


```js
const result = await $pubsub.getTopic('FooTopic')
```

### deleteTopic

Deletes a topic.

Returns true on success.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| name     | Y     | Name of topic to be deleted                  |


```js
const result = await $pubsub.deleteTopic('FooTopic')
```

## Publish Messages to PubSub

Send messages to PubSub topics to trigger subscribers.

### publishMessage

Creates a new message in topic.

Returns id of new message.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| topic     | Y     | Name of topic to publish message                  |
| message | Y | Message to be published.  Type is usually a string or object |

```js
const result = await $pubsub.publishMessage({
  topic: 'FooTopic',
  message: 'What the foo is happening here?'
})
```
