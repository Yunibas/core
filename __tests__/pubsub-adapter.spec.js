const PubSubAdapter = require('../src/adapters/gcp/pubsub')

const ps = new PubSubAdapter('emulator-sandbox')

const fakeTopic = 'FooTopic'

const pause = async (ms = 500) => {
  return new Promise(async (res) => {
    setTimeout(() => {
      res()
    }, ms)
  })
}

describe('Testing PubSub adapter', () => {
  beforeEach(async () => {
    await pause()
  })

  test('createTopic should create a topic', async () => {
    const result = await ps.createTopic(fakeTopic)
    expect(result).toBeTruthy()
  })

  test('publishMessage should submit message', async () => {
    const result = await ps.publishMessage({
      topic: fakeTopic,
      message: 'Houston, we do not have a problem',
    })
    expect(result).toBeTruthy()
  })

  test('getTopics should return multiple topics', async () => {
    const before = await ps.getTopics()
    await ps.createTopic(`${fakeTopic}1`)
    const after = await ps.getTopics()
    expect(after.length).toBeGreaterThan(before.length)
  })

  test('deleteTopic should remove topic', async () => {
    const result = await ps.deleteTopic(fakeTopic)
    const result2 = await ps.deleteTopic(`${fakeTopic}1`)
    expect(result).toBeTruthy()
    expect(result2).toBeTruthy()
  })
})
