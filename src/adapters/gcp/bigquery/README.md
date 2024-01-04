[< Back to Google Cloud Adapters](../README.md)

# BigQuery Adapter

Manage and access data with the BigQuery Adapter.

```js
const { BigQueryAdapter } = require('@yunibas/core')
const $bq = new BigQueryAdapter()
```

## createDataset

Creates a new dataset and returns dataset instance.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| name     | Y     | Name of dataset to be created                  |
| location | N     | GCP location of dataset (default: us-central1) |

```js
const result = await $bq.createDataset({ name: 'foo_dataset' })
```

## getDataset

Retrieves an existing dataset and returns dataset instance.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| name     | Y     | Name of dataset                                |
| location | N     | GCP location of dataset (default: us-central1) |

```js
const result = await $bq.getDataset({ name: 'foo_dataset' })
```

## deleteDataset

Deletes a dataset.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| name     | Y     | Name of dataset                                |
| location | N     | GCP location of dataset (default: us-central1) |

```js
const result = await $bq.getDataset({ name: 'foo_dataset' })
```

## loadFromBucket

Populate a table from file in Cloud Storage

| prop            | req'd | description                                    |
| --------------- | ----- | ---------------------------------------------- |
| dataset         | Y     | Name of dataset                                |
| location        | N     | GCP location of dataset (default: us-central1) |
| table           | Y     | Name of table to populate                      |
| storage         | Y     | Cloud Storage ref                              |
| bucketName      | Y     | Name of bucket                                 |
| fileName        | Y     | File name (including path)                     |
| sourceFormat    | N     | Format of file content (default: "CSV")        |
| skipLeadingRows | N     | Skip first row if headers (default: false)     |
| schema          | N     | BigQuery schema object                         |

```js
const { StorageAdapter } = require(@yunibas/core)
const $storage = new StorageAdpater()

const result = await $bq.loadFromBucket({
  dataset: 'foo_dataset',
  table: 'foo_table',
  storage: $storage,
  bucketName: 'foo_bucket',
  fileName: 'foo_file'
})
```

## runQuery

Execute any supported SQL command.

| prop     | req'd | description                                    |
| -------- | ----- | ---------------------------------------------- |
| sql      | Y     | SQL to be executed                             |
| location | N     | GCP location of dataset (default: us-central1) |

```js
const sql = 'SELECT * FROM foo_dataset.foo_table'
const rows = await $bq.runQuery({ sql })
```
