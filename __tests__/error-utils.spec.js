const { ErrorUtils } = require('../lib')

describe('Testing Error Utils', () => {
  test('errorHandler should return Error from ReferenceError', () => {
    const $error = new ErrorUtils()
    let result
    try {
      console.log(foo)
    } catch (error) {
      result = $error.errorHandler({ error })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('foo is not defined')
  })

  test('errorHandler should return Error from String', () => {
    const $error = new ErrorUtils()
    let result
    try {
      throw 'This was an error'
    } catch (error) {
      result = $error.errorHandler({ error })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('This was an error')
  })

  test('errorHandler should return Error from Number', () => {
    const $error = new ErrorUtils()
    let result
    try {
      throw 500
    } catch (error) {
      result = $error.errorHandler({ error })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('500')
  })

  test('errorHandler should return Error from Object', () => {
    const $error = new ErrorUtils()
    let result
    try {
      throw { name: 'Sam' }
    } catch (error) {
      result = $error.errorHandler({ error })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('{"name":"Sam"}')
  })

  test('errorHandler should return Error from Boolean', () => {
    const $error = new ErrorUtils()
    let result
    try {
      throw false
    } catch (error) {
      result = $error.errorHandler({ error })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('false')
  })

  test('errorHandler should return Error from Undefined', () => {
    const $error = new ErrorUtils()
    let result
    try {
      throw () => {}
    } catch (error) {
      result = $error.errorHandler({ error })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('[Unable to display the error value]')
  })

  test('errorHandler should handle additional params', () => {
    const $error = new ErrorUtils()
    let result
    try {
      throw 'This was an error'
    } catch (error) {
      result = $error.errorHandler({
        error,
        service: 'service',
        process: 'process',
        action: 'action',
        log: true,
      })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('This was an error')
  })

  test('errorHandler should send error to Bugsnag', () => {
    const $error = new ErrorUtils({
      bugsnag: {
        apiKey: '7b766dc9a6be04376da7c43bdda812f3',
        appType: 'test',
        appVersion: '0.0.0',
        context: 'core - test',
        releaseStage: 'test',
      },
    })
    let result
    try {
      throw 'This was an error'
    } catch (error) {
      result = $error.errorHandler({
        error,
        service: 'service',
        process: 'process',
        action: 'action',
        log: true,
      })
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('This was an error')
  })
})
