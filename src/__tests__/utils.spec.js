const TransformUtils = require('../utils/transformation')
const transform = new TransformUtils()

describe('Testing Utils', () => {
  test('should parse pubsub message', () => {
    const result = transform.parsePubSubMessage({
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
