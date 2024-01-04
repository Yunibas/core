[< Back to Google Cloud Adapters](../README.md)

# Firestore Adapter

The Firestore Adapter supports scenarios with up to one subcollection. Nested subcollections are not supported at this time.

```js
const { FirestoreAdapter } = require('@yunibas/core')
const $firestore = new FirestoreAdapter()
// With options
const $firestore = new FirestoreAdapter({
  projectId: 'fooProjectId',
  databaseId: 'fooDatabaseId',
})
```

## List Collections

This call returns an array of collection names.

### Get a list of collections

```typescript
collections = await $firestore.listCollections()
```

### Get a list of subcollections belonging to a document

```typescript
const subcollections = await $firestore.listCollections(collection, id)
```

## Get Document

This call returns a JSON object of the document as it is stored in Firestore.

### Get a document from collection

```typescript
const doc = await $firestore.getDoc({ collection, id })
```

### Get a document from subcollection

```typescript
const doc = await $firestore.getDoc({ collection, id, subcollection, subId })
```

## Get Documents

### Response

In order to support pagination, the response for get documents is an object. This object contains the resulting list of documents in the `docs` key and, when pagination is required, a `startAt` key providing the value to pass into the follow-up queries.

```json
{
  "startAt": 10000,
  "docs": [
    { "id":  1, "name": "Sam" },
    { "id":  2, "name": "Trey" },
    ...
  ]
}
```

### getDocs

```js
const result = await $firestore.getDocs({ collection })
```

### getDocs (filtered)

```typescript
const where = [['population']['>'][5000]]
const result = await $firestore.getDocs({ collection, where })
```

### getDocs (ordered)

```typescript
const orderBy = [['population', 'desc']]
const result = await $firestore.getDocs({ collection, orderBy })
```

### getDocs (limit)

```typescript
const limit = 100
const result = await $firestore.getDocs({ collection, limit })
```

### getDocs (with pagination)

The largest number of documents that can be returned without pagination is 1,000.

If the `where` and `orderBy` are not included in the call, the pagination will use the `created_at` field.

_Note: Firestore requires that the `orderBy` field is also the first field in the where clause._

```js
const where = [['created_at']['>'][1662770000000]]
const orderBy = [['created_at']]
const limit = 1000
let result = await $firestore.getDocs({ collection, where, orderBy, limit })
while (result.startAt) {
  const { startAt } = result
  result = await $firestore.getDocs({
    collection,
    where,
    orderBy,
    limit,
    startAt,
  })
}
```

### getGroupDocs

Search common subcollections without having to iterate collection documents.

```js
const collection = 'counties'
const where = [['population']['>'][5000]]
const orderBy = [['population', 'desc']]
const result = await $firestore.getGroupDocs({ collection, where, orderBy })
```

## Write documents

### addDoc

Creates a new doc in collection or subcollection. Include `id` (or `subid`) to specify the ID for the doc.

Returns the ID of the newly created doc.

| prop          | req'd | description                                                                   |
| ------------- | ----- | ----------------------------------------------------------------------------- |
| collection    | Y     | Name of collection                                                            |
| id            | N     | Document ID when creating doc (required when creating a doc in subcollection) |
| subcollection | N     | Name of subcollection (required when creating a doc in a subcollection)       |
| subid         | N     | Document ID when creating doc in subcollection                                |
| data          | Y     | Object used to create doc                                                     |

```js
const collection = 'users'
const data = { name: 'Troy' }
const result = await $firestore.addDoc({ collection, data })
```

### replaceDoc

Creates or replaces an entire document with new content. If the doc doesn't exist it will be created.

Returns true on success.

| prop          | req'd | description                                                             |
| ------------- | ----- | ----------------------------------------------------------------------- |
| collection    | Y     | Name of collection                                                      |
| id            | Y     | Document ID                                                             |
| subcollection | N     | Name of subcollection (required when updating a doc in a subcollection) |
| subid         | N     | Document ID when updating doc in subcollection                          |
| data          | Y     | Object used to replace/create doc                                       |

```js
const collection = 'users'
const id = 'users_1'
const data = { name: 'Troy M.', title: 'President' }
const result = await $firestore.replaceDoc({ collection, id, data })
```

### updateDoc

Updates a document. Only the data provided will be written to the existing doc; otherwise, the rest of the document remains the same.

Returns true on success.

| prop          | req'd | description                                                             |
| ------------- | ----- | ----------------------------------------------------------------------- |
| collection    | Y     | Name of collection                                                      |
| id            | Y     | Document ID                                                             |
| subcollection | N     | Name of subcollection (required when updating a doc in a subcollection) |
| subid         | N     | Document ID when updating doc in subcollection                          |
| data          | Y     | Object used to update doc                                               |

```js
const collection = 'users'
const id = 'users_1'
const data = { name: 'Troy Moreland' }
const result = await $firestore.updateDoc({ collection, id, data })
```

### deleteDoc

Deletes a document.

Returns true on success.

| prop          | req'd | description                                                             |
| ------------- | ----- | ----------------------------------------------------------------------- |
| collection    | Y     | Name of collection                                                      |
| id            | Y     | Document ID                                                             |
| subcollection | N     | Name of subcollection (required when deleting a doc in a subcollection) |
| subid         | N     | Document ID when deleting doc in subcollection                          |

```js
const collection = 'users'
const id = 'users_1'
const result = await $firestore.deleteDoc({ collection, id })
```

### deleteDocs

Deletes several documents in a batch.

Returns true on success.

| prop          | req'd | description                                                            |
| ------------- | ----- | ---------------------------------------------------------------------- |
| collection    | Y     | Name of collection                                                     |
| id            | N     | Document ID when deleting docs of subcollection                        |
| subcollection | N     | Name of subcollection (required when deleting docs in a subcollection) |
| where         | Y     | Filter to include docs to be deleted                                   |

```js
const collection = 'users'
const where = [['state', '==', 'archive']]
const result = await $firestore.deleteDocs({ collection, where })
```

### deleteDocField

Deletes a document field.

Returns true on success.

| prop          | req'd | description                                                                    |
| ------------- | ----- | ------------------------------------------------------------------------------ |
| collection    | Y     | Name of collection                                                             |
| id            | Y     | Document ID                                                                    |
| subcollection | N     | Name of subcollection (required when deleting docs in a subcollection)         |
| subid         | N     | Document ID when deleting doc field from a subcollection                       |
| field         | Y     | Name of the field to be deleted. Can include nested keys (e.g. "personal.age") |

```js
const collection = 'users'
const id = 'user_1'
const field = 'personal.age'
const result = await $firestore.deleteDocField({ collection, id, field })
```
