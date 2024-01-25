/**
 * Represnets a custom error: UserError
 */
export class UserError extends Error {
  /**
   * Instantiates an object of the class.
   *
   * @param {string} message - error message.
   */
  constructor (message) {
    super(message)

    this.name = 'UserError'

    // Capture the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserError)
    }
  }
}
