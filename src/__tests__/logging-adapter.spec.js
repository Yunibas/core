const LoggingAdapter = require('../adapters/gcp/logging')

const logger = new LoggingAdapter()

describe('testing logging adapter', () => {
   test('should send log without error', () => {
      logger.info('test', {
         timestamp: new Date().toISOString(),
         service: 'logging-adapter',
         process: 'test',
         action: 'test_adapter',
         tenant_id: '1',
         actor: '_service',
         target: '_none',
         request: {},
         response: {},
         env: 'test',
         success: true,
      })
   })
})
