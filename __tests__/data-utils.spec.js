const { DataUtils } = require('../lib')
const $data = new DataUtils()

describe('Testing Data Utils', () => {
  test('objectDiffs should return no diff', () => {
    const result = $data.objectDiffs(
      { name: 'ACME Inc', id: '000000000001' },
      { name: 'ACME Inc', id: '000000000001' }
    )
    expect(result).toBeTruthy()
    expect(result).toStrictEqual({})
  })

  test('objectDiffs should return diff for "id"', () => {
    const result = $data.objectDiffs(
      { name: 'ACME Inc', id: '000000000001' },
      { name: 'ACME Inc', id: '000000000002' }
    )
    expect(result).toBeTruthy()
    expect(result).toHaveProperty('id')
    expect(result.id).toBe('000000000001')
  })

  test('objectDiffs should return nested diff for "age"', () => {
    const result = $data.objectDiffs(
      {
        id: '000000000001',
        meta: {
          age: 10,
        },
      },
      {
        id: '000000000001',
        meta: {
          age: 10,
          height: 180,
        },
      }
    )
    expect(result).toBeTruthy()
    expect(result).toStrictEqual({ meta: {} })
  })

  test('objectDiffs should return no diff missing "height"', () => {
    const result = $data.objectDiffs(
      {
        id: '000000000001',
        meta: {
          age: 10,
        },
      },
      {
        id: '000000000001',
        meta: {
          age: 11,
        },
      }
    )
    expect(result).toBeTruthy()
    expect(result).toHaveProperty('meta.age')
    expect(result.meta.age).toBe(10)
  })

  test('getChangeDiffs should return nested diff for "age"', () => {
    const result = $data.getChangeDiffs(
      {
        id: '000000000001',
        meta: {
          age: 10,
        },
      },
      {
        id: '000000000001',
        meta: {
          age: 11,
        },
      }
    )
    expect(result).toBeTruthy()
    expect(result).toStrictEqual({
      before: { meta: { age: 11 } },
      after: { meta: { age: 10 } },
    })
  })

  test('getChangeDiffs should return nested diff for "height"', () => {
    const result = $data.getChangeDiffs(
      {
        id: '000000000001',
        meta: {
          age: 10,
        },
      },
      {
        id: '000000000001',
        meta: {
          age: 10,
          height: 180,
        },
      }
    )
    console.log(result)
    expect(result).toBeTruthy()
    expect(result).toStrictEqual({
      before: { meta: { height: 180 } },
      after: { meta: {} },
    })
  })

  test('getChangeDiffs should exclude "createdAt" diff', () => {
    const result = $data.getChangeDiffs(
      {
        id: '000000000001',
        createdAt: 99999999,
      },
      {
        id: '000000000001',
        createdAt: 88888888,
      },
      ['createdAt']
    )
    console.log(result)
    expect(result).toBeTruthy()
    expect(result).toStrictEqual({
      before: {},
      after: {},
    })
  })
})
