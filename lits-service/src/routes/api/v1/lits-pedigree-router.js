/**
 * Lit routes.
 *
 * @author Ragdolls
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import express from 'express'
import createError from 'http-errors'

export const router = express.Router()

/**
 * Resolves a LitsPedigreeController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a LitsPedigreeController object.
 */
const resolveLitsPedigreeController = (req) => req.app.get('container').resolve('LitsPedigreeController')

/**
 * Authenticate requests.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    const publicKey = Buffer.from(process.env.ACCESS_TOKEN_PUBLIC, 'base64')

    const payload = jwt.verify(token, publicKey)
    req.user = {
      id: payload.sub,
      username: payload.username,
      email: payload.email
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}

// ============== ROUTES ==============

// GET resources
router.get('/', authenticateJWT, (req, res, next) => resolveLitsPedigreeController(req).findAll(req, res, next))

// GET resources for a searched pedigree
router.get('/:username', (req, res, next) => resolveLitsPedigreeController(req).findAllSearch(req, res, next))
