const StorageAdapter = require('../src/adapters/gcp/storage')

// const storage = new StorageAdapter()
const storage = new StorageAdapter({ projectId: 'emulator-sandbox' })

const fakeBucket = `yunibas-prms-dev-${new Date().valueOf()}`
const fakeBucket2 = `yunibas-prms-dev-${new Date().valueOf() + 1}`
const fakeFile = 'FooFile'
const fakeFile2 = 'FooFile2'
const fakeContents = 'FooContents'

describe('Testing Storage adapter', () => {
  test('createBucket should create a bucket', async () => {
    const result = await storage.createBucket({ bucketName: fakeBucket })
    expect(result).toBeTruthy()
    expect(result.name).toBe(fakeBucket)
  })
  test('listBuckets should return array of buckets including created bucket', async () => {
    const result = await storage.listBuckets()
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThan(0)
  })
  test('saveFile should create file in bucket', async () => {
    const result = await storage.saveFile({
      bucketName: fakeBucket,
      fileName: fakeFile,
      content: fakeContents,
    })
    expect(result).toBeTruthy()
  })
  test('listFiles should find file in bucket', async () => {
    const result = await storage.listFiles({
      bucketName: fakeBucket,
    })
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].name).toBe(fakeFile)
  })
  test('downloadFile should save file to local destination', async () => {
    const result = await storage.downloadFile({
      bucketName: fakeBucket,
      fileName: fakeFile,
      destination: `/Users/tmoreland/Desktop/${fakeFile}`,
    })
    expect(result).toBeTruthy()
    // expect(result).toBe(fakeContents)
  })
  test('renameFile should rename file', async () => {
    const result = await storage.renameFile({
      bucketName: fakeBucket,
      fileName: fakeFile,
      newFileName: fakeFile2,
    })
    expect(result).toBeTruthy()
  })
  test('copyFile should make a new copy of file', async () => {
    const result = await storage.copyFile({
      bucketName: fakeBucket,
      fileName: fakeFile2,
      newFileName: fakeFile,
    })
    const files = await storage.listFiles({
      bucketName: fakeBucket,
    })
    expect(result).toBeTruthy()
    expect(files).toBeTruthy()
    expect(files.length).toBe(2)
  })
  test('moveFile should move file to new bucket', async () => {
    const bucket = await storage.createBucket({ bucketName: fakeBucket2 })
    const result = await storage.moveFile({
      bucketName: fakeBucket,
      fileName: fakeFile,
      newBucketName: fakeBucket2,
    })
    const files = await storage.listFiles({
      bucketName: fakeBucket2,
    })
    expect(bucket).toBeTruthy()
    expect(result).toBeTruthy()
    expect(files).toBeTruthy()
    expect(files.length).toBe(1)
  })
  test('deleteBucket should delete a bucket', async () => {
    const result = await storage.deleteBucket(fakeBucket)
    expect(result).toBeTruthy()
  })
  test('deleteBucket should delete second bucket', async () => {
    const result = await storage.deleteBucket(fakeBucket2)
    expect(result).toBeTruthy()
  })
})
