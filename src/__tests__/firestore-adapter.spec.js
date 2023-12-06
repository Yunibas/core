const FirestoreAdapter = require('../adapters/gcp/firestore')

const fs = new FirestoreAdapter()
// const fs = new FirestoreAdapter('emulator-sandbox')
// const fs = new FirestoreAdapter({
//   projectId: 'emulator-sandbox',
//   databaseId: 'foo',
// })

const collection = 'fake_collection'
const subcollection = 'sub_collection'

describe('Testing Cloud Firestore calls', () => {
  let count = 0,
    original_count = 0,
    docId = ''

  const $deleteDoc = async ({ collection, id, subcollection, subid }) => {
    return await fs.deleteDoc({ collection, id, subcollection, subid })
  }

  // const $deleteSubcollectionDocs = async () => {
  //    let results = await fs.getGroupDocs({ collection: subcollection })
  //    await Promise.all(
  //       results.docs.map(async (doc) => {
  //          await $deleteDoc({
  //             collection: doc.parent_collection,
  //             id: doc.parent_doc,
  //             subcollection: subcollection,
  //             subid: doc.id,
  //          })
  //       })
  //    )
  // }

  const $deleteCollectionDocs = async () => {
    const results = await fs.getDocs({ collection })
    await Promise.all(
      results.docs.map(async (doc) => {
        await $deleteDoc({ collection, id: doc.id })
      })
    )
  }

  beforeAll(async () => {
    // await $deleteSubcollectionDocs()
    await $deleteCollectionDocs()
  })

  afterAll(async () => {
    // await $deleteSubcollectionDocs()
    // await $deleteCollectionDocs()
  })

  test('should return collections', async () => {
    const result = await fs.listCollections()
    expect(Array.isArray(result)).toBe(true)
  })

  test('should return array', async () => {
    const result = await fs.getDocs({ collection })
    count = result.count
    original_count = count
    expect(typeof count).toBe('number')
    expect(Array.isArray(result.docs)).toBe(true)
  })

  test('should add a document', async () => {
    const result = await fs.addDoc({
      collection,
      data: {
        name: 'John Doe',
        foo: ['bar', 'baz'],
      },
    })
    docId = result
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  test('should return doc', async () => {
    const result = await fs.getDoc({ collection, id: docId })
    expect(result).toMatchObject({ name: 'John Doe' })
  })

  test('should return array of one', async () => {
    const result = await fs.getDocs({ collection })
    count = result.count
    expect(count).toBe(1)
    expect(result.docs.length).toBe(1)
  })

  test('should return empty array', async () => {
    const result = await fs.getDocs({
      collection,
      id: docId,
      subcollection: 'foo',
    })
    count = result.count
    expect(count).toBe(0)
    expect(result.docs.length).toBe(0)
  })

  test('should replace a document', async () => {
    await fs.replaceDoc({
      collection,
      id: docId,
      data: {
        id: '123',
        name: 'Johnny Doe',
        foo: ['bar', 'bay'],
        birthdate: '01/01/2000',
      },
    })
    const result = await fs.getDoc({ collection, id: docId })
    expect(result).toBeTruthy()
    expect(result).toMatchObject({ name: 'Johnny Doe' })
  })

  test('should query with where value in array', async () => {
    let results = { count: 0, docs: [] }
    const where = [['id', 'in', ['123', '321']]]
    let result = await fs.getDocs({ collection, where })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    expect(Array.isArray(result.docs)).toBe(true)
    expect(results.count).toBe(1)
  })

  test('should query with where array contains', async () => {
    let results = { count: 0, docs: [] }
    const where = [['foo', 'array-contains', 'bar']]
    let result = await fs.getDocs({ collection, where })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    expect(Array.isArray(result.docs)).toBe(true)
    expect(results.count).toBe(1)
  })

  test('should update a document', async () => {
    await fs.updateDoc({
      collection,
      id: docId,
      data: {
        birthdate: '01/01/2001',
      },
    })
    const result = await fs.getDoc({ collection, id: docId })
    expect(result).toMatchObject({
      birthdate: '01/01/2001',
      name: 'Johnny Doe',
    })
  })

  test('should add a subcollection document', async () => {
    const result = await fs.addDoc({
      collection,
      id: docId,
      subcollection,
      data: {
        name: 'Foo',
      },
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  let subid
  // TODO: Requires an index to be created
  test.skip('should return one subcollection group doc', async () => {
    const result = await fs.getGroupDocs({ collection: subcollection })
    subid = result.docs[0].id
    expect(Array.isArray(result.docs)).toBe(true)
    expect(result.docs.length).toBe(1)
  })

  test('should return subcollection array of one', async () => {
    const result = await fs.getDocs({
      collection,
      id: docId,
      subcollection,
    })
    count = result.count
    expect(count).toBe(1)
    expect(result.docs.length).toBe(1)
  })

  test('should delete a subcollection doc', async () => {
    const result = await fs.deleteDoc({
      collection,
      id: docId,
      subcollection: subcollection,
      subid,
    })
    expect(result).toBeTruthy()
  })

  test('should delete a document', async () => {
    const result = await fs.deleteDoc({ collection, id: docId })
    expect(result).toBeTruthy()
  })

  test('should return same number of docs', async () => {
    const result = await fs.getDocs({ collection })
    expect(result.docs.length).toBe(original_count)
  })

  test('should add 20 documents', async () => {
    for (let i = 0; i < 20; i++) {
      const result = await fs.addDoc({
        collection,
        data: {
          name: 'Foo',
          created_at: new Date().valueOf(),
        },
      })
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    }
  })

  test('should query with where', async () => {
    let results = { count: 0, docs: [] }
    const where = [['name', '==', 'Foo']]
    let result = await fs.getDocs({ collection, where })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    expect(Array.isArray(result.docs)).toBe(true)
    expect(results.count).toBe(20)
  })

  test('should query with order by', async () => {
    let results = { count: 0, docs: [] }
    const orderBy = [['id', 'desc'], ['name']]
    let result = await fs.getDocs({ collection, orderBy })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    expect(Array.isArray(result.docs)).toBe(true)
    expect(results.count).toBe(20)
  })

  test('should query with pagination', async () => {
    let results = { count: 0, docs: [] }
    const limit = 5
    let result = await fs.getDocs({ collection, limit })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    while (result.startAt) {
      result = await fs.getDocs({
        collection,
        limit: 5,
        startAt: result.startAt,
      })
      results.docs = results.docs.concat(result.docs)
      results.count += result.count
    }
    expect(results.count).toBeGreaterThan(limit)
    expect(Array.isArray(result.docs)).toBe(true)
  })
})
