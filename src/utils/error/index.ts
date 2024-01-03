export {}

const Utils = require('../BaseUtils')

module.exports = class ErrorUtils extends Utils {
  constructor() {
    super()
  }

  errorHandler = (err: unknown) => {
    if (err instanceof Error) {
      return err
    }

    let stringified = '[Unable to display the error value]'
    if (typeof err === 'string') {
      stringified = err
    }
    if (
      typeof err === 'number' ||
      typeof err === 'boolean' ||
      typeof err === 'object'
    ) {
      stringified = JSON.stringify(err)
    }

    return new Error(String(stringified))
  }
}
