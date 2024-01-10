export {}
const { PubSub } = require('@google-cloud/pubsub')
const GoogleCloudAdapter = require('../GoogleCloudAdapter')

const { ErrorUtils } = require('../../../utils')

const $error = new ErrorUtils()

type TConstructorPropsObject = {
  projectId: string
}
type TConstructorProps = TConstructorPropsObject | string
type TPubSubPublish = {
  topic: string
  message: string | Record<string, any>
}

module.exports = class PubSubAdapter extends GoogleCloudAdapter {
  constructor(props: TConstructorProps) {
    super()
    this.pubsub
    if (props && typeof props === 'object') {
      this.pubsub = new PubSub(props)
    } else if (props && typeof props === 'string') {
      this.pubsub = new PubSub({ projectId: props })
    } else {
      this.pubsub = new PubSub()
    }
  }

  createTopic = async (name: string) => {
    try {
      const [exists] = await this.pubsub.topic(name).exists()
      if (!exists) {
        await this.pubsub.createTopic(name)
      }
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  getTopics = async () => {
    try {
      let response: Record<string, any>[] = []
      const [topics] = await this.pubsub.getTopics()
      for (let topic of topics) {
        response.push(topic)
      }
      return response
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  getTopic = async (name: string) => {
    try {
      const [topic] = await this.pubsub.topic(name)
      return topic
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  deleteTopic = async (name: string) => {
    try {
      const [exists] = await this.pubsub.topic(name).exists()
      if (exists) await this.pubsub.topic(name).delete()
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  publishMessage = async (props: TPubSubPublish) => {
    try {
      let { topic, message } = props
      let dataBuffer
      if (typeof message === 'string') {
        dataBuffer = Buffer.from(message)
      } else {
        dataBuffer = Buffer.from(JSON.stringify(message))
      }
      const messageId = await this.pubsub
        .topic(topic)
        .publishMessage({ data: dataBuffer })
      return messageId
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }
}
