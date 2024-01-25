/**
 * @file Defines the main router.
 * @module routes/router
 * @version 1.0.0
 */

import express from 'express'
import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as userRouter } from './userRouter.js'
import { router as pedigreeRouter } from './pedigreeRouter.js'
import { router as litsRouter } from './litsRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/user', userRouter)
router.use('/pedigree', pedigreeRouter)
router.use('/litter-box', litsRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})
