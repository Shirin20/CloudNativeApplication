/**
 * @file Defines the home router.
 * @module routes/homeRouter
 * @version 1.0.0
 */

import express from 'express'
export const router = express.Router()
// import { HomeController } from '../controllers/HomeController.js'

/**
 * Resolves a home controller object.
 *
 * @param {object} req - Express request object.
 * @returns {object} homecontroller object.
 */
const resolveHomeController = (req) => {
  return req.app.get('container').resolve('HomeController')
}

// const controller = new HomeController()

// router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/', (req, res, next) => resolveHomeController(req).index(req, res, next))
