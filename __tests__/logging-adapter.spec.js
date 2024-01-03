const LoggingAdapter = require('../src/adapters/gcp/logging')

const $logger = new LoggingAdapter()

describe('testing logging adapter', () => {
  test('should send debug log ', async () => {
    const result = await $logger.debug({
      log_name: 'test',
      message: {
        env: 'test',
        timestamp: new Date().toISOString(),
        service: 'logging-adapter',
        process: 'testing logging adapter',
        action: 'should send debug log',
        tenant_id: '1',
        success: true,
      },
    })
    expect(result).toBeTruthy()
  })

  test('should send warn log ', async () => {
    const result = await $logger.warn({
      log_name: 'test',
      message: {
        env: 'test',
        timestamp: new Date().toISOString(),
        service: 'logging-adapter',
        process: 'testing logging adapter',
        action: 'should send warn log',
        tenant_id: '1',
        success: true,
      },
    })
    expect(result).toBeTruthy()
  })

  test('should send error log ', async () => {
    const result = await $logger.error({
      log_name: 'test',
      message: {
        env: 'test',
        timestamp: new Date().toISOString(),
        service: 'logging-adapter',
        process: 'testing logging adapter',
        action: 'should send error log',
        tenant_id: '1',
        success: true,
      },
    })
    expect(result).toBeTruthy()
  })

  test('should send info log with labels', async () => {
    const result = await $logger.info({
      log_name: 'test',
      labels: {
        location: 'test',
        service: 'logging-adapter',
        method: 'testing logging adapter',
      },
      message: {
        env: 'test',
        timestamp: new Date().toISOString(),
        service: 'logging-adapter',
        process: 'testing logging adapter',
        action: 'should send info log with labels',
        tenant_id: '1',
        success: true,
      },
    })
    expect(result).toBeTruthy()
  })
})
