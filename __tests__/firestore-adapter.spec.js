const FirestoreAdapter = require('../lib/adapters/gcp/firestore')

// const fs = new FirestoreAdapter()
const fs = new FirestoreAdapter('emulator-sandbox')
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
    await $deleteCollectionDocs()
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

  test('should add a document with provided id', async () => {
    const result = await fs.addDoc({
      collection,
      id: '123abc',
      data: {
        name: 'John Black',
      },
    })
    expect(result).toBeDefined()
    expect(result).toBe('123abc')
    await fs.deleteDoc({ collection, id: '123abc' })
  })

  test('should return doc', async () => {
    const result = await fs.getDoc({ collection, id: docId })
    expect(result).toMatchObject({ name: 'John Doe' })
  })

  test('should return array of at least one', async () => {
    const result = await fs.getDocs({ collection })
    count = result.count
    expect(count).toBeGreaterThanOrEqual(1)
    expect(result.docs.length).toBeGreaterThanOrEqual(1)
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

  test('should delete a document field', async () => {
    await fs.deleteDocField({
      collection,
      id: docId,
      field: 'birthdate',
    })
    const result = await fs.getDoc({ collection, id: docId })
    expect(result).toBeTruthy()
    expect(result.birthdate).toBeFalsy()
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
  test('should return one subcollection group doc', async () => {
    const result = await fs.getGroupDocs({ collection: subcollection })
    subid = result.docs[0].id
    expect(Array.isArray(result.docs)).toBe(true)
    expect(result.docs.length).toBeGreaterThanOrEqual(1)
  })

  test('should return subcollection array of one', async () => {
    const result = await fs.getDocs({
      collection,
      id: docId,
      subcollection,
    })
    count = result.count
    expect(count).toBeGreaterThanOrEqual(1)
    expect(result.docs.length).toBeGreaterThanOrEqual(1)
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
          age: i + 1,
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
    expect(results.count).toBeGreaterThanOrEqual(20)
  })

  test('should query with where and filter', async () => {
    let results = { count: 0, docs: [] }
    const where = [
      [
        'or',
        [
          ['age', '==', 1],
          ['age', '==', 2],
        ],
      ],
      ['name', '==', 'Foo'],
    ]
    let result = await fs.getDocs({ collection, where })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    expect(Array.isArray(result.docs)).toBe(true)
    expect(results.count).toBe(2)
  })

  test('should query with order by', async () => {
    let results = { count: 0, docs: [] }
    const orderBy = [['id', 'desc'], ['name']]
    let result = await fs.getDocs({ collection, orderBy })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    expect(Array.isArray(result.docs)).toBe(true)
    expect(results.count).toBeGreaterThanOrEqual(20)
  })

  test('should return total number of docs in context', async () => {
    const where = [['age', '>', 17]]
    const result = await fs.getDocCount({ collection, where })
    expect(result).toBe(3)
  })

  test('should add 20 documents', async () => {
    for (let i = 0; i < 20; i++) {
      const result = await fs.addDoc({
        collection,
        data: {
          name: 'Foo',
          age: i + 1,
          created_at: new Date().valueOf(),
        },
      })
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    }
  })

  test('should query with server-side pagination', async () => {
    let results = { count: 0, docs: [] }
    const limit = 2
    const where = [['name', '==', 'Foo']]
    const clientSidePagination = false
    let result = await fs.getDocs({
      collection,
      where,
      limit,
      clientSidePagination,
    })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    while (result.startAfter) {
      result = await fs.getDocs({
        collection,
        limit,
        where,
        startAfter: result.startAfter,
        clientSidePagination,
      })
      results.docs = results.docs.concat(result.docs)
      results.count += result.count
    }
    expect(results.count).toBe(40)
    expect(Array.isArray(results.docs)).toBe(true)
  })

  test('should query with client-side pagination', async () => {
    let results = { count: 0, docs: [] }
    const limit = 2
    const where = [['name', '==', 'Foo']]
    let result = await fs.getDocs({ collection, where, limit })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    while (result.startAfter) {
      result = await fs.getDocs({
        collection,
        limit,
        where,
        startAfter: result.startAfter,
      })
      results.docs = results.docs.concat(result.docs)
      results.count += result.count
    }
    expect(results.count).toBe(40)
    expect(Array.isArray(results.docs)).toBe(true)
  })

  test('should query with server-side pagination and sorting', async () => {
    let results = { count: 0, docs: [] }
    const limit = 2
    const orderBy = [['age', 'desc']]
    const where = [['name', '==', 'Foo']]
    const clientSidePagination = false
    let result = await fs.getDocs({
      collection,
      limit,
      orderBy,
      where,
      clientSidePagination,
    })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    while (result.startAfter) {
      result = await fs.getDocs({
        collection,
        limit,
        orderBy,
        where,
        startAfter: result.startAfter,
        clientSidePagination,
      })
      results.docs = results.docs.concat(result.docs)
      results.count += result.count
    }
    expect(results.count).toBe(40)
    expect(Array.isArray(result.docs)).toBe(true)
  })

  test('should have invalid server-side pagination results when not using same parameters', async () => {
    let results = { count: 0, docs: [] }
    const limit = 2
    const orderBy = [['age', 'desc']]
    const where = [['name', '==', 'Foo']]
    const clientSidePagination = false
    let result = await fs.getDocs({
      collection,
      limit,
      orderBy,
      where,
      clientSidePagination,
    })
    results.docs = results.docs.concat(result.docs)
    results.count += result.count
    while (result.startAfter) {
      result = await fs.getDocs({
        collection,
        limit,
        where,
        startAfter: result.startAfter,
        clientSidePagination,
      })
      results.docs = results.docs.concat(result.docs)
      results.count += result.count
    }
    expect(results.count).toBeLessThan(40)
    expect(Array.isArray(result.docs)).toBe(true)
  })

  test('should delete documents in batch', async () => {
    const result = await fs.deleteDocs({
      collection,
      where: [['name', '==', 'Foo']],
    })
    expect(result).toBeTruthy()
  })
})
