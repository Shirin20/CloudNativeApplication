/**
 * @file Defines the user router.
 * @module routes/userRouter
 * @version 1.0.0
 */

import express from 'express'
export const router = express.Router()

/**
 * Resolves a user controller object.
 *
 * @param {object} req - Express request object.
 * @returns {object} homecontroller object.
 */
const resolveUserController = (req) => {
  return req.app.get('container').resolve('UserController')
}

router.get('/register', (req, res, next) => resolveUserController(req).showRegister(req, res, next))

router.post('/register', (req, res, next) => resolveUserController(req).registerUser(req, res, next))

router.get('/login', (req, res, next) => resolveUserController(req).showLogin(req, res, next))

router.post('/login', (req, res, next) => resolveUserController(req).login(req, res, next))

router.get('/logout', (req, res, next) => resolveUserController(req).logout(req, res, next))
