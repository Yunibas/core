const PubSubAdapter = require('../adapters/gcp/pubsub')

const ps = new PubSubAdapter()

const fakeTopic = 'FooTopic'

const pause = async (ms = 500) => {
  return new Promise(async (res) => {
    setTimeout(() => {
      res()
    }, ms)
  })
}

const deleteAllTopics = async () => {
  return new Promise(async (res, rej) => {
    const topics = await ps.getTopics()
    await Promise.all(
      topics.map((topic) => {
        ps.deleteTopic(topic.name)
      })
    )
    res()
  })
}

describe('Testing PubSub adapter', () => {
  beforeEach(async () => {
    await deleteAllTopics()
    await pause()
  })

  afterAll(async () => {
    await deleteAllTopics()
    await pause()
  })

  test('should create a topic', async () => {
    const result = await ps.createTopic(fakeTopic)
    expect(result).toBeTruthy()
  })

  test('should submit message to topic', async () => {
    await ps.createTopic(fakeTopic)
    const result = await ps.publishMessage({
      topic: fakeTopic,
      message: 'Houston, we do not have a problem',
    })
    expect(result).toBeTruthy()
  })

  test('should return multiple topics', async () => {
    await ps.createTopic(`${fakeTopic}1`)
    await ps.createTopic(`${fakeTopic}2`)
    const result = await ps.getTopics()
    expect(result.length).toBe(2)
  })

  test('should return no topics', async () => {
    const result = await ps.getTopics()
    expect(result.length).toBe(0)
  })
})
