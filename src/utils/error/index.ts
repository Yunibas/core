export {}
const Bugsnag = require('@bugsnag/js')
const Utils = require('../BaseUtils')

type ErrorHandlerProps = {
  error: unknown
  service?: string
  process?: string
  action?: string
  log?: boolean
}

type BugsnagConfig = {
  apiKey: string
  appType?: string
  appVersion?: string
  context?: string
  releaseStage?: string
}

type ConstructorProps = {
  bugsnag?: BugsnagConfig
}

module.exports = class ErrorUtils extends Utils {
  constructor(props: ConstructorProps) {
    super()
    if (props?.bugsnag) {
      this.useBugsnag = true
      Bugsnag.start(props.bugsnag)
    }
  }

  /**
   * @description Error handler
   * @param {object|string|number|boolean|unknown} error
   * @param {string} [service] - Identifies the source service.
   * @param {string} [process] - Identifies the source process.
   * @param {string} [action] - Identifies the source action.
   * @param {boolean} [log] - Specifies whether to include a console error log.
   * @returns {Error}
   */
  errorHandler = (props: ErrorHandlerProps) => {
    const { error, service, process, action, log } = props

    // Handle error value
    let $error = error
    if (!(error instanceof Error)) {
      let stringified = '[Unable to display the error value]'
      if (typeof error === 'string') {
        stringified = error
      }
      if (
        typeof error === 'number' ||
        typeof error === 'boolean' ||
        typeof error === 'object'
      ) {
        stringified = JSON.stringify(error)
      }

      $error = new Error(String(stringified))
    }

    if (log) {
      let message = ($error as Error).message
      if (action) {
        message = `[${action}] ${message}`
      }
      if (process) {
        message = `[${process}] ${message}`
      }
      if (service) {
        message = `[${service}] ${message}`
      }
      console.error(message)
    }

    if (this.useBugsnag) {
      Bugsnag.notify($error)
    }

    return $error
  }
}
