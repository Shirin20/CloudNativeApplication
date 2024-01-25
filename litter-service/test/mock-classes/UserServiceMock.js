/* eslint-disable jsdoc/require-jsdoc */
import { UserService } from '../../src/services/UserService.js'

export class UserServiceMock extends UserService {
  /**
   * Sends request to auth service to register user.
   *
   * @param {object} req - Express request object.
   * @returns {boolean} true/false
   */
  async register (req) {
    // wait response from auth service
    return true
  }

  /**
   * Sends request to auth service to login user.
   *
   * @param {object} req - Express request object.
   * @returns {object} user - ...
   */
  async login (req) {
    return { id: 1, name: 'user1' }
  }
}
