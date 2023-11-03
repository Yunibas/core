const Utils = require('../utils')

const utils = new Utils()

describe('Testing Utils', () => {
  test('should parse pubsub message', () => {
    const result = utils.parsePubSubMessage({
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
