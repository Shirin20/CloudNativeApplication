/**
 * @file Defines the PedigreeController class.
 * @module controllers/PedigreeController
 * @version 1.0.0
 * @author Ragdoll
 */

import { PedigreeService } from '../services/PedigreeService.js'

/**
 * Encapsulates a controller.
 */
export class PedigreeController {
  /**
   * @type {PedigreeService}
   */
  #service
  /**
   * Instantiates an object of type PedigreeController.
   *
   * @param {PedigreeService} service - ...
   */
  constructor (service = new PedigreeService()) {
    this.#service = service
  }

  /**
   * Shows the pedigree for the requested user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserPedigree (req, res, next) {
    try {
      const viewData = await this.#service.getUserFullPedigree(req)
      res.render('pedigree/logged-in-user', { viewData })
    } catch (error) {
      this.#handleErrorAndRedirect(error, req, res, '../user/login')
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
  async showSearch (req, res, next) {
    try {
      res.render('pedigree/search')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns the followedusers of logged in user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getFollowedUsers (req, res, next) {
    try {
      res.json({
        followedUsers: req.session.user?.followedUsers
      })
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
  async searchUser (req, res, next) {
    try {
      const searchedUser = await this.#service.search(req)

      // Get lits for searched user:
      if (searchedUser) {
        req.searchedUser = searchedUser
        const viewData = await this.#service.getSearchedUserFullPedigree(req)
        res.render('pedigree/user', { viewData })
      } else {
        res.render('pedigree/search')
      }
    } catch (error) {
      this.#handleErrorAndRedirect(error, req, res, '../pedigree/search')
    }
  }

  /**
   * Adds an user to the logged in users follows list.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} user - ...
   */
  async addToFollows (req, res, next) {
    try {
      const follows = await this.#service.addToFollows(req)
      console.log(follows.message)
      req.session.flash = { type: 'success', text: 'The user was added successfully.' }
      res.redirect('../../litter-box')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Removes an user to the logged in users follows list.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} user - ...
   */
  async removeFromFollows (req, res, next) {
    try {
      const removed = await this.#service.removeFromFollows(req)
      console.log(removed.message)
      req.session.flash = { type: 'success', text: 'The user is no longer followed.' }
      res.redirect('../../litter-box')
    } catch (error) {
      this.#handleErrorAndRedirect(error, req, res, '../../litter-box')
    }
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
    console.log('error: ', error)
    req.session.flash = { type: 'danger', text: error.message, name: error.name || 'Error' }
    res.redirect(path)
  }
}
