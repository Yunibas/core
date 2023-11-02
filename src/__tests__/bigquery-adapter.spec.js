// TODO: Add test for loadFromBucket

const BigQueryAdapter = require('../adapters/gcp/bigquery')

const bq = new BigQueryAdapter()

const dataset = 'fake_dataset'
const table = 'fake_table'

describe.skip('Testing BigQuery calls', () => {
  test('should not return dataset', async () => {
    let result
    try {
      result = await bq.getDataset({ name: dataset })
    } catch {
      expect(result).toBeFalsy()
    }
  })

  test('should create dataset', async () => {
    const result = await bq.createDataset({ name: dataset })
    expect(result).toBeTruthy()
  })

  test('should create table', async () => {
    const sql = `
         CREATE TABLE \`${dataset}.${table}\` (
            message STRING
         );
         INSERT INTO \`${dataset}.${table}\`
            (message) VALUES ('Hello World');
         `
    const result = await bq.runQuery({ sql })
    expect(result).toBeTruthy()
  })

  test('should run query', async () => {
    const sql = `SELECT * FROM \`${dataset}.${table}\``
    const [rows] = await bq.runQuery({ sql })
    expect(rows).toBeTruthy()
  })

  test('should find dataset', async () => {
    const result = await bq.getDataset({ name: dataset })
    expect(result).toBeTruthy()
  })

  test('should delete dataset', async () => {
    const result = await bq.deleteDataset(dataset)
    expect(result).toBeTruthy()
  })
})
