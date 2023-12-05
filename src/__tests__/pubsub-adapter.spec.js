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
    console.log('start afterAll')
    await deleteAllTopics()
    console.log('end afterAll')
    await pause()
  })

  test('should create a topic', async () => {
    console.log('start test1')
    const result = await ps.createTopic(fakeTopic)
    expect(result).toBeTruthy()
    console.log('end test1')
  })

  test('should submit message to topic', async () => {
    console.log('start test2')
    await ps.createTopic(fakeTopic)
    const result = await ps.publishMessage({
      topic: fakeTopic,
      message: 'Houston, we do not have a problem',
    })
    expect(result).toBeTruthy()
    console.log('end test2')
  })

  test('should return multiple topics', async () => {
    console.log('start test3')
    await ps.createTopic(`${fakeTopic}1`)
    await ps.createTopic(`${fakeTopic}2`)
    const result = await ps.getTopics()
    expect(result.length).toBe(2)
    console.log('start test3')
  })

  test('should return no topics', async () => {
    console.log('start test4')
    const result = await ps.getTopics()
    expect(result.length).toBe(0)
    console.log('end test4')
  })
})
