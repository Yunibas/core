const { ErrorUtils } = require('../lib')
const $error = new ErrorUtils()

describe('Testing Error Utils', () => {
  test('errorHandler should return Error from ReferenceError', () => {
    let result
    try {
      console.log(foo)
    } catch (error) {
      result = $error.errorHandler(error)
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('foo is not defined')
  })

  test('errorHandler should return Error from String', () => {
    let result
    try {
      throw 'This was an error'
    } catch (error) {
      result = $error.errorHandler(error)
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('This was an error')
  })

  test('errorHandler should return Error from Number', () => {
    let result
    try {
      throw 500
    } catch (error) {
      result = $error.errorHandler(error)
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('500')
  })

  test('errorHandler should return Error from Object', () => {
    let result
    try {
      throw { name: 'Sam' }
    } catch (error) {
      result = $error.errorHandler(error)
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('{"name":"Sam"}')
  })

  test('errorHandler should return Error from Boolean', () => {
    let result
    try {
      throw false
    } catch (error) {
      result = $error.errorHandler(error)
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('false')
  })

  test('errorHandler should return Error from Undefined', () => {
    let result
    try {
      throw () => {}
    } catch (error) {
      result = $error.errorHandler(error)
    }
    expect(result).toBeTruthy()
    expect(result instanceof Error).toBeTruthy()
    expect(result.message).toBe('[Unable to display the error value]')
  })
})
