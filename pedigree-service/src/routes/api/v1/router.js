/**
 * API version 1 routes.
 *
 * @author Ragdoll
 * @version 1.0.0
 */

import express from 'express'
import { router as pedigreeRouter } from './pedigree-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json(apiRootResponse(req)))

router.use('/pedigree', pedigreeRouter)

/**
 * Creates a collection link object for a given Express request and HTTP method.
 *
 * @function
 * @param {object} req - The Express request object.
 * @returns {object} An object containing the 'resource', 'HTTPMethod', and 'href' properties for the self link.
 */
function apiRootResponse (req) {
  return {
    Api: 'Welcome to Pedigree restful API!',
    availableServices: ['pedigree'],
    links: [
        `${req.protocol}://${req.get('host')}${req.baseUrl}/pedigree`
    ]
  }
}
