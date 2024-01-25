import { LitService } from '../../services/LitService.js'

/**
 * Module for the Lits Pedigree controller.
 */
export class LitsPedigreeController {
  /**
   * The service.
   *
   * @type {LitService} - The LitService instance.
   */
  #litService

  /**
   * Initializes a new instance.
   *
   * @param {LitService} service - A service instantiated from a class with the same capabilities as LitService.
   */
  constructor (service = new LitService()) {
    this.#litService = service
  }

  /**
   * Sends a JSON response containing all resources.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const userId = req.user.id
      const lits = await this.#litService.getAllResourcesByFilter({ userId })

      lits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      res
        .json(lits)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles non authenticated search for a user's pedigree.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAllSearch (req, res, next) {
    try {
      const username = req.params.username
      const lits = await this.#litService.getAllResourcesByFilter({ username })

      lits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      res
        .json(lits)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
