// TODO: Add test for loadFromBucket

const BigQueryAdapter = require('../src/adapters/gcp/bigquery')

const bq = new BigQueryAdapter()

const dataset = 'fake_dataset'
const table = 'fake_table'

describe('Testing BigQuery calls', () => {
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
    expect(result).toHaveProperty('id')
    expect(result.id).toMatch(dataset)
  })

  test('should return dataset', async () => {
    const result = await bq.getDataset({ name: dataset })
    expect(result).toBeTruthy()
    expect(result).toHaveProperty('id')
    expect(result.id).toMatch(dataset)
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
    const result = await bq.runQuery({ sql })
    expect(result).toBeTruthy()
    expect(result.length).toBe(1)
  })

  test('should delete dataset', async () => {
    const result = await bq.deleteDataset({ name: dataset })
    expect(result).toBeTruthy()
  })
})
