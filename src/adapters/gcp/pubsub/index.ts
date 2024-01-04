export {}
const { PubSub } = require('@google-cloud/pubsub')
const GoogleCloudAdapter = require('../GoogleCloudAdapter')

const { ErrorUtils } = require('../../../utils')

const pubsub = new PubSub()
const $error = new ErrorUtils()

interface IPubSubPublish {
  topic: string
  message: string | Record<string, any>
}

module.exports = class PubSubAdapter extends GoogleCloudAdapter {
  constructor() {
    super()
  }

  createTopic = async (name: string) => {
    try {
      const [exists] = await pubsub.topic(name).exists()
      if (!exists) {
        await pubsub.createTopic(name)
      }
      return true
    } catch (error) {
      throw $error.errorHandler(error)
    }
  }

  getTopics = async () => {
    try {
      let response: Record<string, any>[] = []
      const [topics] = await pubsub.getTopics()
      for (let topic of topics) {
        response.push(topic)
      }
      return response
    } catch (error) {
      throw $error.errorHandler(error)
    }
  }

  getTopic = async (name: string) => {
    try {
      const [topic] = await pubsub.topic(name)
      return topic
    } catch (error) {
      throw $error.errorHandler(error)
    }
  }

  deleteTopic = async (name: string) => {
    try {
      const [exists] = await pubsub.topic(name).exists()
      if (exists) await pubsub.topic(name).delete()
      return true
    } catch (error) {
      throw $error.errorHandler(error)
    }
  }

  publishMessage = async (props: IPubSubPublish) => {
    try {
      let { topic, message } = props
      let dataBuffer
      if (typeof message === 'string') {
        dataBuffer = Buffer.from(message)
      } else {
        dataBuffer = Buffer.from(JSON.stringify(message))
      }
      const messageId = await pubsub
        .topic(topic)
        .publishMessage({ data: dataBuffer })
      return messageId
    } catch (error) {
      throw $error.errorHandler(error)
    }
  }
}
