export {}
const { Logging } = require('@google-cloud/logging')
const GoogleCloudAdapter = require('../GoogleCloudAdapter')

const logging = new Logging()

type TLogEntryMessage = {
   event_id?: string | number
   timestamp: string
   env: string
   tenant_ref: string
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
   severity?: string
   log_name: string
   message: TLogEntryMessage
}

const write_entry = async (props: TLogEntry) => {
   const { severity, log_name, message } = props
   await logging.setDetectedResource()
   const log = logging.log(log_name)
   const metadata = {
      resource: { type: 'global' },
      severity,
   }
   const entry = log.entry(metadata, message)
   log.write(entry)
}

module.exports = class LoggingAdapter extends GoogleCloudAdapter {
   constructor() {
      super()
   }

   debug = (log_name: string, message: TLogEntryMessage) => {
      write_entry({ severity: 'DEBUG', log_name, message })
   }
   info = (log_name: string, message: TLogEntryMessage) => {
      write_entry({ severity: 'INFO', log_name, message })
   }
   warn = (log_name: string, message: TLogEntryMessage) => {
      write_entry({ severity: 'WARN', log_name, message })
   }
   error = (log_name: string, message: TLogEntryMessage) => {
      write_entry({ severity: 'ERROR', log_name, message })
   }
}
