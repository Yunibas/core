export {}
const transform = require('lodash/transform')
const isEqual = require('lodash/isEqual')
const isObject = require('lodash/isObject')
const isArray = require('lodash/isArray')

const Utils = require('../BaseUtils')

module.exports = class DataUtils extends Utils {
  constructor() {
    super()
  }

  objectDiffs = (
    newObj: Record<string, unknown>,
    oldObj: Record<string, any>
  ) => {
    const result = transform(
      newObj,
      (result: Record<string, unknown>, value: any, key: string) => {
        if (!isEqual(value, oldObj[key])) {
          result[key] =
            isObject(value) && !isArray(value) && isObject(oldObj[key])
              ? this.objectDiffs(value, oldObj[key])
              : value
        }
      }
    )

    if (!result || JSON.stringify(result) === '{}') return null

    return result
  }

  getChangeDiffs = (
    newObj: Record<string, unknown>,
    oldObj: Record<string, unknown>,
    exclude = []
  ) => {
    exclude.forEach((field: string) => {
      delete newObj[field]
      delete oldObj[field]
    })
    const before = this.objectDiffs(oldObj, newObj)
    const after = this.objectDiffs(newObj, oldObj)
    return { before, after }
  }
}
