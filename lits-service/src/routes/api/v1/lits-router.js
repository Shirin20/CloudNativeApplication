/**
 * Lit routes.
 *
 * @author Ragdolls
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import express from 'express'
import createError from 'http-errors'
import { Lit } from '../../../models/lit.js'

export const router = express.Router()

/**
 * Resolves a LitsController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a LitsController object.
 */
const resolveLitsController = (req) => req.app.get('container').resolve('LitsController')

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
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}

/**
 * Authorization function for getting all lits whose creator are the current authenticated user.
 *
 * @param {*} req - Express request object.
 * @param {*} res - Express response object.
 * @param {*} next - Next function call.
 * @returns {Error} - An error page.
 */
const authorizeUser = async (req, res, next) => {
  const authorized = await Lit.authorizeUserLitModification(req, res, next)
  if (authorized) {
    next()
  } else {
    return next(createError(401, 'You are not authorized to modify this lit'))
  }
}

// ============== ROUTES ==============

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to lits router!' }))

// Provide req.lit to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => resolveLitsController(req).loadLit(req, res, next, id))

// POST lits
router.post('/', authenticateJWT, (req, res, next) => resolveLitsController(req).create(req, res, next))

// // PUT lits/:id
router.put('/:id', authenticateJWT, authorizeUser, (req, res, next) => resolveLitsController(req).update(req, res, next))

// DELETE lits/:id
router.delete('/:id', authenticateJWT, authorizeUser, (req, res, next) => resolveLitsController(req).delete(req, res, next))
