const { DataUtils, TransformUtils } = require('../lib')
const $data = new DataUtils()
const $transform = new TransformUtils()

describe('Testing Transformation Utils', () => {
  let $event

  test('should encode firestore event', async () => {
    const result = await $transform.encodeFirestoreEvent({
      document: 'tenants/000000000001',
      data: {
        value: {
          fields: {
            name: { stringValue: 'ACME Inc' },
            createTime: { stringValue: '2021-10-14T14:35:26.970927Z' },
            id: { stringValue: '000000000001' },
          },
          name: 'projects/yunibas-prms-dev/databases/(default)/documents/tenants/000000000001',
          createTime: {
            seconds: { low: 1702662126, high: 0, unsigned: false },
            nanos: 970927000,
          },
          updateTime: {
            seconds: { low: 1702662126, high: 0, unsigned: false },
            nanos: 970927000,
          },
        },
        oldValue: {
          fields: {
            name: { stringValue: 'ACME Inc' },
            createTime: { stringValue: '2021-10-13T14:35:26.970927Z' },
            id: { stringValue: '000000000001' },
          },
          name: 'projects/yunibas-prms-dev/databases/(default)/documents/tenants/000000000001',
          createTime: {
            seconds: { low: 1702662126, high: 0, unsigned: false },
            nanos: 970927000,
          },
          updateTime: {
            seconds: { low: 1702662126, high: 0, unsigned: false },
            nanos: 970927000,
          },
        },
        updateMask: { fieldPaths: ['name'] },
      },
    })
    $event = result
    expect(result).toBeTruthy()
  })

  test('should decode encoded firestore event', async () => {
    const result = await $transform.decodeFirestoreEvent($event)
    expect(result).toBeTruthy()
    expect(result.collection).toBeTruthy()
    expect(result.docId).toBeTruthy()
    expect(result.data.value).toBeTruthy()
  })

  test('should decode firestore create event', async () => {
    const result = await $transform.decodeFirestoreEvent({
      document: 'tenants/000000000001',
      data: [
        10, 150, 1, 10, 76, 112, 114, 111, 106, 101, 99, 116, 115, 47, 121, 117,
        110, 105, 98, 97, 115, 45, 112, 114, 109, 115, 45, 100, 101, 118, 47,
        100, 97, 116, 97, 98, 97, 115, 101, 115, 47, 40, 100, 101, 102, 97, 117,
        108, 116, 41, 47, 100, 111, 99, 117, 109, 101, 110, 116, 115, 47, 116,
        101, 110, 97, 110, 116, 115, 47, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
        48, 49, 18, 19, 10, 4, 110, 97, 109, 101, 18, 11, 138, 1, 8, 65, 67, 77,
        69, 32, 73, 110, 99, 18, 21, 10, 2, 105, 100, 18, 15, 138, 1, 12, 48,
        48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 26, 12, 8, 238, 159, 242,
        171, 6, 16, 152, 215, 252, 206, 3, 34, 12, 8, 238, 159, 242, 171, 6, 16,
        152, 215, 252, 206, 3,
      ],
    })
    expect(result).toBeTruthy()
    expect(result.collection).toBeTruthy()
    expect(result.docId).toBeTruthy()
    expect(result.data.value).toBeTruthy()
  })

  test('should decode firestore update event', async () => {
    const result = await $transform.decodeFirestoreEvent({
      document: 'tenants/000000000001',
      data: [
        10, 151, 1, 10, 76, 112, 114, 111, 106, 101, 99, 116, 115, 47, 121, 117,
        110, 105, 98, 97, 115, 45, 112, 114, 109, 115, 45, 100, 101, 118, 47,
        100, 97, 116, 97, 98, 97, 115, 101, 115, 47, 40, 100, 101, 102, 97, 117,
        108, 116, 41, 47, 100, 111, 99, 117, 109, 101, 110, 116, 115, 47, 116,
        101, 110, 97, 110, 116, 115, 47, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
        48, 49, 18, 21, 10, 2, 105, 100, 18, 15, 138, 1, 12, 48, 48, 48, 48, 48,
        48, 48, 48, 48, 48, 48, 49, 18, 20, 10, 4, 110, 97, 109, 101, 18, 12,
        138, 1, 9, 65, 67, 77, 69, 44, 32, 73, 110, 99, 26, 12, 8, 238, 159,
        242, 171, 6, 16, 152, 215, 252, 206, 3, 34, 12, 8, 179, 206, 242, 171,
        6, 16, 152, 139, 138, 183, 3, 18, 151, 1, 10, 76, 112, 114, 111, 106,
        101, 99, 116, 115, 47, 121, 117, 110, 105, 98, 97, 115, 45, 112, 114,
        109, 115, 45, 100, 101, 118, 47, 100, 97, 116, 97, 98, 97, 115, 101,
        115, 47, 40, 100, 101, 102, 97, 117, 108, 116, 41, 47, 100, 111, 99,
        117, 109, 101, 110, 116, 115, 47, 116, 101, 110, 97, 110, 116, 115, 47,
        48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 18, 21, 10, 2, 105, 100,
        18, 15, 138, 1, 12, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 18,
        20, 10, 4, 110, 97, 109, 101, 18, 12, 138, 1, 9, 65, 67, 77, 69, 44, 32,
        76, 76, 67, 26, 12, 8, 238, 159, 242, 171, 6, 16, 152, 215, 252, 206, 3,
        34, 12, 8, 139, 198, 242, 171, 6, 16, 240, 232, 221, 154, 2, 26, 6, 10,
        4, 110, 97, 109, 101,
      ],
    })
    expect(result).toBeTruthy()
    expect(result.data.value).toBeTruthy()
  })

  test('should not find a diff', async () => {
    const response = await $transform.decodeFirestoreEvent($event)

    const result = await $transform.parseUpdateDiff(
      response.data.oldValue.fields,
      response.data.value.fields,
      ['createTime', 'updateTime']
    )
    expect(result).toBeFalsy()
  })

  test('should decode firestore update diff', async () => {
    const response = await $transform.decodeFirestoreEvent({
      document: 'tenants/000000000001',
      data: [
        10, 151, 1, 10, 76, 112, 114, 111, 106, 101, 99, 116, 115, 47, 121, 117,
        110, 105, 98, 97, 115, 45, 112, 114, 109, 115, 45, 100, 101, 118, 47,
        100, 97, 116, 97, 98, 97, 115, 101, 115, 47, 40, 100, 101, 102, 97, 117,
        108, 116, 41, 47, 100, 111, 99, 117, 109, 101, 110, 116, 115, 47, 116,
        101, 110, 97, 110, 116, 115, 47, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
        48, 49, 18, 21, 10, 2, 105, 100, 18, 15, 138, 1, 12, 48, 48, 48, 48, 48,
        48, 48, 48, 48, 48, 48, 49, 18, 20, 10, 4, 110, 97, 109, 101, 18, 12,
        138, 1, 9, 65, 67, 77, 69, 44, 32, 73, 110, 99, 26, 12, 8, 238, 159,
        242, 171, 6, 16, 152, 215, 252, 206, 3, 34, 12, 8, 179, 206, 242, 171,
        6, 16, 152, 139, 138, 183, 3, 18, 151, 1, 10, 76, 112, 114, 111, 106,
        101, 99, 116, 115, 47, 121, 117, 110, 105, 98, 97, 115, 45, 112, 114,
        109, 115, 45, 100, 101, 118, 47, 100, 97, 116, 97, 98, 97, 115, 101,
        115, 47, 40, 100, 101, 102, 97, 117, 108, 116, 41, 47, 100, 111, 99,
        117, 109, 101, 110, 116, 115, 47, 116, 101, 110, 97, 110, 116, 115, 47,
        48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 18, 21, 10, 2, 105, 100,
        18, 15, 138, 1, 12, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 18,
        20, 10, 4, 110, 97, 109, 101, 18, 12, 138, 1, 9, 65, 67, 77, 69, 44, 32,
        76, 76, 67, 26, 12, 8, 238, 159, 242, 171, 6, 16, 152, 215, 252, 206, 3,
        34, 12, 8, 139, 198, 242, 171, 6, 16, 240, 232, 221, 154, 2, 26, 6, 10,
        4, 110, 97, 109, 101,
      ],
    })

    const result = await $transform.parseUpdateDiff(
      response.data.oldValue.fields,
      response.data.value.fields,
      ['createTime', 'updateTime']
    )
    expect(result).toBeTruthy()
  })

  test('should decode firestore delete event', async () => {
    const result = await $transform.decodeFirestoreEvent({
      document: 'tenants/000000000001',
      data: [
        10, 151, 1, 10, 76, 112, 114, 111, 106, 101, 99, 116, 115, 47, 121, 117,
        110, 105, 98, 97, 115, 45, 112, 114, 109, 115, 45, 100, 101, 118, 47,
        100, 97, 116, 97, 98, 97, 115, 101, 115, 47, 40, 100, 101, 102, 97, 117,
        108, 116, 41, 47, 100, 111, 99, 117, 109, 101, 110, 116, 115, 47, 116,
        101, 110, 97, 110, 116, 115, 47, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
        48, 49, 18, 21, 10, 2, 105, 100, 18, 15, 138, 1, 12, 48, 48, 48, 48, 48,
        48, 48, 48, 48, 48, 48, 49, 18, 20, 10, 4, 110, 97, 109, 101, 18, 12,
        138, 1, 9, 65, 67, 77, 69, 44, 32, 73, 110, 99, 26, 12, 8, 238, 159,
        242, 171, 6, 16, 152, 215, 252, 206, 3, 34, 12, 8, 179, 206, 242, 171,
        6, 16, 152, 139, 138, 183, 3, 18, 151, 1, 10, 76, 112, 114, 111, 106,
        101, 99, 116, 115, 47, 121, 117, 110, 105, 98, 97, 115, 45, 112, 114,
        109, 115, 45, 100, 101, 118, 47, 100, 97, 116, 97, 98, 97, 115, 101,
        115, 47, 40, 100, 101, 102, 97, 117, 108, 116, 41, 47, 100, 111, 99,
        117, 109, 101, 110, 116, 115, 47, 116, 101, 110, 97, 110, 116, 115, 47,
        48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 18, 21, 10, 2, 105, 100,
        18, 15, 138, 1, 12, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 18,
        20, 10, 4, 110, 97, 109, 101, 18, 12, 138, 1, 9, 65, 67, 77, 69, 44, 32,
        76, 76, 67, 26, 12, 8, 238, 159, 242, 171, 6, 16, 152, 215, 252, 206, 3,
        34, 12, 8, 139, 198, 242, 171, 6, 16, 240, 232, 221, 154, 2, 26, 6, 10,
        4, 110, 97, 109, 101,
      ],
    })
    expect(result).toBeTruthy()
    expect(result.collection).toBeTruthy()
    expect(result.docId).toBeTruthy()
    expect(result.data.value).toBeTruthy()
  })

  test('should parse pubsub message', () => {
    const result = $transform.parsePubSubMessage({
      data: {
        message: {
          data: Buffer.from('{"foo":"bar"}').toString('base64'),
        },
      },
    })
    expect(result).toBeTruthy()
    expect(result.foo).toBe('bar')
  })
})
