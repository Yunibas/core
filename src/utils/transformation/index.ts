export {}
const protobuf = require('protobufjs')
const fs = require('fs')

const Utils = require('../BaseUtils')
const DataUtils = require('../data')
const { ErrorUtils } = require('../error')

const $data = new DataUtils()
const $error = new ErrorUtils()

type TMessage = any
type TEvent = any

const isLive = !fs.existsSync('./lib')
const protoPath = isLive
  ? './node_modules/@yunibas/core/lib/proto/data.proto'
  : './lib/proto/data.proto'

module.exports = class TransformUtils extends Utils {
  constructor() {
    super()
  }

  parsePubSubMessage = (message: TMessage) => {
    try {
      const raw_message = message.data.message.data
      if (!raw_message) throw new Error('Missing message')

      const str_message = Buffer.from(raw_message, 'base64').toString()
      if (!JSON.parse(str_message)) throw new Error('Malformed message')

      const event = JSON.parse(str_message)
      return event
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  decodeFirestoreEvent = async (event: TEvent) => {
    try {
      const docParts = event.document.split('/')
      const collection = docParts[0]
      const docId = docParts[1]

      const root = await protobuf.load(protoPath)
      const DocumentEventData = root.lookupType(
        'google.events.cloud.firestore.v1.DocumentEventData'
      )

      const data = DocumentEventData.decode(event.data)
      return {
        collection,
        docId,
        data,
      }
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  encodeFirestoreEvent = async (event: TEvent) => {
    try {
      const root = await protobuf.load(protoPath)
      const DocumentEventData = root.lookupType(
        'google.events.cloud.firestore.v1.DocumentEventData'
      )

      const data = DocumentEventData.encode(event.data).finish()

      return {
        ...event,
        data,
      }
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  parseUpdateDiff = (before: TEvent, after: TEvent, exclude = []) => {
    try {
      const diff = $data.getChangeDiffs(after, before, exclude)
      //TODO: Probably isn't accurate when objects are nested
      if (!diff.after && !diff.before) {
        return false
      }

      return diff
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }
}
