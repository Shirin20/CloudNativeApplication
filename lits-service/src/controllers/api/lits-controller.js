/**
 * Module for the LitController.
 *
 * @author Ragdolls
 * @version 1.0.0
 */

import { LitService } from '../../services/LitService.js'
import createError from 'http-errors'
import { Producer } from '../../rabbitmq/producer.js'
import { DateTrimmer } from '../../config/DateTrimmer.js'

/**
 * Encapsulates a controller.
 */
export class LitsController {
  /**
   * Represents the rabbitmq publish mechanism.
   */
  producer = new Producer()

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
   * Provide req.lit to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the lit to load.
   */
  async loadLit (req, res, next, id) {
    try {
      // Get the lit.
      const lit = await this.#litService.getById(id)

      // If no lit found send a 404 (Not Found).
      if (!lit) {
        next(createError(404, 'The requested lit was not found.'))
        return
      }
      // Provide the lit to req.
      req.lit = lit

      // Next middleware.
      next()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a lit.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      const litId = req.lit.id
      const lit = await this.#litService.getById(litId)

      res
        .json(lit)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new lit.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const litText = req.body.litText
      const userPedigreeLink = req.body.userPedigreeLink
      const userId = req.user.id
      const username = req.user.username

      const lit = await this.#litService.insert({
        litText, userPedigreeLink, userId, username
      })

      // Publish a message to RabbitMQ after creating the lit
      const dateTrimmer = new DateTrimmer()
      console.log('lit:', JSON.stringify(lit.createdAt))
      const litDate = dateTrimmer.trim(JSON.stringify(lit.createdAt))
      const litMessage = JSON.stringify({
        litId: lit._id,
        createdAt: `${litDate.date} ${litDate.time}`,
        userId,
        litText,
        userPedigreeLink,
        username
      })

      await this.producer.publishMessage(litMessage)

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${lit._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(lit)
    } catch (error) {
      console.log('The error: ', error)
      next(error)
    }
  }

  /**
   * Updates a specific lit.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const lit = await this.#litService.getById(req.params.id)
      const litId = req.params.id
      const litText = req.body.litText

      if (lit) {
        await this.#litService.update(litId, { litText })

        res
          .status(204)
          .end()
      } else {
        res
          .status(404)
          .end()
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes the specified lit.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const deletedLit = req.lit.id
      await this.#litService.delete(deletedLit)

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
