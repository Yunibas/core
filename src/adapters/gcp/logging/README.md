[< Back to Google Cloud Adapters](../README.md)

# Cloud Logging Adapter

The Cloud Logging Adapter is used to write meaningful logs to the Cloud Logging service.

```js
const { LoggingAdapter } = require('@yunibas/core')
const $logger = new LoggingAdapter()
```

## Write logs

These calls will write to the Cloud Logging service where the method is equal to the severity.

Every method support arguments for "log_name", "labels", and "message".

### debug

```typescript
$logger.debug()
```

### Get a list of collections belonging to a document

```typescript
const collections = await listCollections(collection, doc_id)
```

## Get Document

This call returns a JSON object of the document as it is stored in Firestore.

### Get a document from collection
```typescript
const doc = await getDoc({collection, doc_id})
```

### Get a document from subcollection
```typescript
const doc = await getDoc({collection, doc_id, subcollection, subdoc_id})
```

## Get Documents

### Response

In order to support pagination, the response for get documents is an object.  This object contains the resulting list of documents in the `docs` key and, when pagination is required, a `startAt` key providing the value to pass into the follow-up queries.

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

### Get a list of documents
```typescript
const result = await getDocs({collection})
```

### Get a filtered list of documents
```typescript
const where = [['population']['>'][5000]]
const result = await getDocs({collection, where})
```

### Get an ordered list of documents
```typescript
const orderBy = 'population'
const result = await getDocs({collection, orderBy})
```

### Get a limited number of documents
```typescript
const limit = 100
const result = await getDocs({collection, limit})
```

### Get a large list of documents with pagination

The largest number of documents that can be returned without pagination is 1,000.

If the `where` and `orderBy` are not included in the call, the pagination will use the `created_at` field.

_Note: Firestore requires that the `orderBy` field is also the first field in the where clause._

```typescript
const where = [['created_at']['>'][1662770000000]]
const orderBy = 'created_at'
const limit = 1000
let result = await getDocs({collection,where,orderBy,limit})
while (result.startAt) {
  const { startAt } = result
  result = await getDocs({collection,where,orderBy,limit,startAt})
}
```