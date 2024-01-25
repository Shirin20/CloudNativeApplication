/**
 * @file Defines the UserController class.
 * @module controllers/PedigreeController
 * @author Ragdoll.
 * @version 1.0.0
 */

import { UserService } from '../services/UserService.js'

/**
 * Usercontroller class.
 */
export class UserController {
  /**
   * @type {UserService}
   */
  #service
  /**
   * Instantiates an object of type UserController.
   *
   * @param {UserService} service - ...
   */
  constructor (service = new UserService()) {
    this.#service = service
  }

  /**
   * Renders register view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {boolean} true/false
   */
  async showRegister (req, res, next) {
    try {
      res.render('user/register')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Registers user..
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {boolean} true/false
   */
  async registerUser (req, res, next) {
    try {
      const user = await this.#service.register(req)
      console.log('The user was successfully registered: ', user)
      req.session.flash = { type: 'success', text: 'The user was registered successfully.' }
      res.redirect('../user/login')
    } catch (error) {
      this.#handleErrorAndRedirect(error, req, res, '../user/register')
    }
  }

  /**
   * Renders login view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} user - ...
   */
  async showLogin (req, res, next) {
    try {
      res.render('user/login')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends request to auth service to login user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} user - ...
   */
  async login (req, res, next) {
    try {
      const token = await this.#service.login(req)
      req.session.accessToken = token.access_token
      req.session.loggedIn = true
      res.redirect('../pedigree')
    } catch (error) {
      this.#handleErrorAndRedirect(error, req, res, '../user/login')
    }
  }

  /**
   * Destroys the session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  logout (req, res, next) {
    req.session.destroy()
    res.redirect('../user/login')
  }

  /**
   * Handles an error and redirects to the specified path.
   *
   * @param {Error} error - The error to handle.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {string} path - The path to redirect to.
   */
  #handleErrorAndRedirect (error, req, res, path) {
    req.session.flash = { type: 'danger', text: error.message, name: error.name || 'Error' }
    res.redirect(path)
  }
}
