export {}
const { Logging } = require('@google-cloud/logging')
const GoogleCloudAdapter = require('../GoogleCloudAdapter')

const { ErrorUtils } = require('../../../utils')

const $errorUtils = new ErrorUtils()

type TProps = {
  log_name: string
  labels?: object
  message: TLogEntryMessage
}

type TLogEntryMessage = {
  event_id?: string | number
  timestamp: string
  env: string
  tenant_id: string
  service: string
  process: string
  actor_ref?: string
  target_ref?: string
  action: string
  request?: string | object
  response?: string | object
  success: boolean
  auxiliary?: string | number | object
}

type TLogEntry = {
  severity: string
  log_name: string
  labels?: object
  message: TLogEntryMessage
}

const write_entry = async (props: TLogEntry) => {
  try {
    const { severity, log_name, labels, message } = props

    const $logging = new Logging()

    await $logging.setDetectedResource()

    // Selects the log to write to
    const log = $logging.log(log_name)

    // The metadata associated with the entry
    const metadata = {
      resource: {
        type: 'global',
      },
      labels: labels || {},
      severity,
    }

    // Prepares a log entry
    const entry = log.entry(metadata, message)

    log.write(entry) // Writes the log entry

    return void 0
  } catch (err) {
    throw $errorUtils.errorHandler(err)
  }
}

module.exports = class LoggingAdapter extends GoogleCloudAdapter {
  constructor() {
    super()
  }

  debug = async (props: TProps) => {
    try {
      await write_entry({ severity: 'DEBUG', ...props })
      return true
    } catch (error) {
      throw $errorUtils.errorHandler(error)
    }
  }

  info = async (props: TProps) => {
    try {
      await write_entry({ severity: 'INFO', ...props })
      return true
    } catch (error) {
      throw $errorUtils.errorHandler(error)
    }
  }

  warn = async (props: TProps) => {
    try {
      await write_entry({ severity: 'WARNING', ...props })
      return true
    } catch (error) {
      throw $errorUtils.errorHandler(error)
    }
  }

  error = async (props: TProps) => {
    try {
      await write_entry({ severity: 'ERROR', ...props })
      return true
    } catch (error) {
      throw $errorUtils.errorHandler(error)
    }
  }
}
