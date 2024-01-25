/**
 * @file Defines the Lits router.
 * @module routes/litsRouter
 * @version 1.0.0
 */

import express from 'express'
export const router = express.Router()
// import { LitsController } from '../controllers/LitsController.js'

/**
 * Resolves a Lits controller object.
 *
 * @param {object} req - Express request object.
 * @returns {object} Litscontroller object.
 */
const resolveLitsController = (req) => {
  return req.app.get('container').resolve('LitsController')
}

router.get('/', (req, res, next) => resolveLitsController(req).index(req, res, next))

router.post('/create', (req, res, next) => resolveLitsController(req).createLit(req, res, next))
