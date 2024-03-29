export {}
import Bugsnag from '@bugsnag/js'
const Utils = require('../BaseUtils')

type ErrorHandlerProps = {
  error: unknown
  service?: string
  process?: string
  action?: string
  log?: boolean
  statusCode?: number
}

type BugsnagConfig = {
  apiKey: string
  appType?: string
  appVersion?: string
  context?: string
  releaseStage?: string
}

type ConstructorProps = {
  bugsnag?: BugsnagConfig | boolean
}

// Custom error class to allow for custom status codes
class CustomError extends Error {
  constructor(message: string, statusCode?: number) {
    super(message)
    this.statusCode = statusCode || 500
  }
  statusCode: number
}

class ServiceError extends CustomError {
  constructor(message: string, props: ErrorHandlerProps) {
    super(message, props.statusCode || 500)
    this.name = 'ServiceError'
    const $error = new ErrorUtils()
    $error.errorHandler(props)
  }
}

class ControllerError extends CustomError {
  constructor(message: string, props: ErrorHandlerProps) {
    super(message, props.statusCode || 500)
    this.name = 'ControllerError'
    const $error = new ErrorUtils()
    $error.errorHandler(props)
  }
}

class ErrorUtils extends Utils {
  useBugsnag: boolean

  constructor(props?: ConstructorProps) {
    super()
    this.useBugsnag = false
    if (props?.bugsnag) {
      this.useBugsnag = true
      Bugsnag.start(props.bugsnag as BugsnagConfig)
    }
  }

  /**
   * @description Error handler
   * @param {object} props
   * @param {object|string|number|boolean|unknown} props.error
   * @param {string} [props.service] - Identifies the source service.
   * @param {string} [props.process] - Identifies the source process.
   * @param {string} [props.action] - Identifies the source action.
   * @param {boolean} [props.log] - Specifies whether to include a console error log.
   * @param {boolean} [props.statusCode] - Sets the HTTP status code for the error or defaults to 500.
   * @param {boolean} [props.bugsnag] - Specifies whether to report error to BugSnag.
   * @returns {Error}
   */
  errorHandler = (props: ErrorHandlerProps): Error => {
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
      Bugsnag.notify($error as Error)
    }

    return $error as Error
  }
}

module.exports = { ErrorUtils, CustomError, ServiceError, ControllerError }
