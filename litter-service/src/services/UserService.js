/**
 * @file Defines the UserService class.
 * @module services/UserService
 * @version 1.0.0
 * @author Ragdoll
 */

import { UserError } from '../custom-error/userError.js'

/**
 * Encapsulates an User service.
 */
export class UserService {
  /**
   * Sends request to auth service to register user.
   *
   * @param {object} req - Express request object.
   * @returns {boolean} true/false
   */
  async register (req) {
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      favoriteCat: req.body.favoriteCat
    }
    const response = await fetch(process.env.AUTH_REGISTER_STRING, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })

    if (response.status === 400) {
      throw new UserError('Please make sure that the email is valid and that the username doesn\'t contain å,ä or ö')
    } else if (response.status === 409) {
      throw new UserError('The username is already taken, please try with another one.')
    } else if (!response.ok) {
      throw new UserError('Something went wrong with the register process. Please try again later.')
    }

    return response.json()
  }

  /**
   * Sends request to auth service to login user.
   *
   * @param {object} req - Express request object.
   * @returns {object} user - ...
   */
  async login (req) {
    const credentials = {
      username: req.body.username,
      password: req.body.password
    }
    const response = await fetch(process.env.AUTH_LOGIN_STRING, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    if (response.status === 401) {
      throw new UserError('Wrong username or password.')
    } else if (!response.ok) {
      throw new UserError('Something went wrong with the login process, please try again later.')
    }

    return response.json()
  }

  /**
   * Destroys the session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    req.session.destroy()
  }
}
