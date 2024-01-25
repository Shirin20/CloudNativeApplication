/**
 * Module for the AccountController.
 */

// import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.username, req.body.password)

      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        favoriteCat: user.favoriteCat
      }

      const privateKey = Buffer.from(process.env.ACCESS_TOKEN_PRIVATE, 'base64')
      // Create the access token with the shorter lifespan
      const accessToken = jwt.sign(payload, privateKey,
        {
          algorithm: 'RS256',
          expiresIn: 60 * 1000 * 20
        })

      res
        .json({
          access_token: accessToken
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.cause = error

      next(err)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      console.log(req.body)
      const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        favoriteCat: req.body.favoriteCat
      })

      await user.save()

      res
        .status(201)
        .json({ id: user.id })
    } catch (error) {
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.cause = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.cause = error
      }

      next(err)
    }
  }

  /**
   * Searches for a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async search (req, res, next) {
    try {
      const username = req.params.username

      const user = await User.findOne({ username })

      res
        .status(200)
        .json({
          id: user.id,
          username: user.username,
          favoriteCat: user.favoriteCat
        })
    } catch (error) {
      const err = createError(404)
      err.cause = error

      next(err)
    }
  }
}
