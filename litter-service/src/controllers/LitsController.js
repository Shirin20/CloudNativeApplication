/**
 * @file Defines the LitsController class.
 * @module controllers/LitsController
 * @version 1.0.0
 * @author Ragdoll
 */

import { LitsService } from '../services/LitsService.js'
/**
 * Encapsulates a controller.
 */
export class LitsController {
  /**
   * @type {LitsService}
   */
  #service
  /**
   * Instantiates an object of type LitsController.
   *
   * @param {LitsService} service - ...
   */
  constructor (service = new LitsService()) {
    this.#service = service
  }

  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      if (req.session.user?.id) {
        const allLits = await this.#service.getLits(req)
        const viewData = {
          lits: allLits.mergedAndSortedLits
        }
        res.render('litter-box/index', { viewData })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a POST request to lit service to create new lit.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createLit (req, res, next) {
    try {
      const lit = await this.#service.create(req)
      console.log('Lit created: ', lit.id)

      req.session.flash = { type: 'success', text: 'The lit was created successfully.' }

      res.redirect('.')
    } catch (error) {
      this.#handleErrorAndRedirect(error, req, res, '..')
      next(error)
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
    req.session.flash = { type: 'danger', text: error.message, name: error.name || 'Error' }
    res.redirect(path)
  }
}
