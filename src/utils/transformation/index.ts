export {}
const protobuf = require('protobufjs')
const fs = require('fs')

const Utils = require('../BaseUtils')
const DataUtils = require('../data')
const $data = new DataUtils()

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
    const raw_message = message.data.message.data
    if (!raw_message) throw new Error('Missing message')

    const str_message = Buffer.from(raw_message, 'base64').toString()
    if (!JSON.parse(str_message)) throw new Error('Malformed message')

    const event = JSON.parse(str_message)
    return event
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
      console.error(error)
      throw new Error()
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
      console.error(error)
      throw new Error()
    }
  }

  parseUpdateDiff = (before: TEvent, after: TEvent, exclude = []) => {
    try {
      const diff = $data.getChangeDiffs(after, before, exclude)

      if (!Object.keys(diff.after).length && !Object.keys(diff.before).length) {
        return false
      }

      return diff
    } catch (error) {
      console.error(error)
      throw new Error()
    }
  }
}
