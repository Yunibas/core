export {}
const { PubSub } = require('@google-cloud/pubsub')
const GoogleCloudAdapter = require('../GoogleCloudAdapter')

const pubsub = new PubSub()

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
      } catch (error: unknown) {
         let message
         if (error instanceof Error) message = error.message
         else message = String(error)
         console.error('createTopic', message)
         throw new Error(message)
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
      } catch (error: unknown) {
         let message
         if (error instanceof Error) message = error.message
         else message = String(error)
         console.error('getTopics', message)
         throw new Error(message)
      }
   }

   getTopic = async (name: string) => {
      try {
         const [topic] = await pubsub.topic(name)
         return topic
      } catch (error: unknown) {
         let message
         if (error instanceof Error) message = error.message
         else message = String(error)
         console.error('getTopic', message)
         throw new Error(message)
      }
   }

   deleteTopic = async (name: string) => {
      try {
         const [exists] = await pubsub.topic(name).exists()
         if (exists) await pubsub.topic(name).delete()
         return true
      } catch (error: unknown) {
         let message
         if (error instanceof Error) message = error.message
         else message = String(error)
         console.error('deleteTopic', message)
         throw new Error(message)
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
         console.log('publishMessage', 'topic', topic)
         const messageId = await pubsub
            .topic(topic)
            .publishMessage({ data: dataBuffer })
         return messageId
      } catch (error: unknown) {
         let message
         if (error instanceof Error) message = error.message
         else message = String(error)
         console.error('publishMessage', message)
         throw new Error(message)
      }
   }
}
