/**
 * @file Defines the Pedigree router.
 * @module routes/PedigreeRouter
 * @version 1.0.0
 */

import express from 'express'
export const router = express.Router()

/**
 * Resolves a pedigreeController object.
 *
 * @param {object} req - Express request object.
 * @returns {object} homecontroller object.
 */
const resolvePedigreeController = (req) => {
  return req.app.get('container').resolve('PedigreeController')
}

router.get('/', (req, res, next) => resolvePedigreeController(req).getUserPedigree(req, res, next))

router.get('/search', (req, res, next) => resolvePedigreeController(req).showSearch(req, res, next))

router.post('/search', (req, res, next) => resolvePedigreeController(req).searchUser(req, res, next))

router.post('/leash/:id', (req, res, next) => resolvePedigreeController(req).addToFollows(req, res, next))

router.post('/unleash/:id', (req, res, next) => resolvePedigreeController(req).removeFromFollows(req, res, next))

router.get('/followed-users', (req, res, next) => resolvePedigreeController(req).getFollowedUsers(req, res, next))
