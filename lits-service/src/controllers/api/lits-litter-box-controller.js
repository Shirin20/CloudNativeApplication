import { LitService } from '../../services/LitService.js'

/**
 * Module for the litter box controller.
 */
export class LitsLitterBoxController {
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
      const userIds = [req.user.id, ...(req.body.followedUsers || [])]
      let mergedAndSortedLits = []

      for (const userId of userIds) {
        const lits = await this.#litService.getAllResourcesByFilter({ userId })
        mergedAndSortedLits = mergedAndSortedLits.concat(lits)
      }
      mergedAndSortedLits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      res.json({ mergedAndSortedLits })
    } catch (error) {
      next(error)
    }
  }
}
