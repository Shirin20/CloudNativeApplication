/**
 * API version 1 routes.
 *
 * @author Ragdolls
 * @version 1.0.0
 */

import express from 'express'
import { router as litsRouter } from './lits-router.js'
import { router as pedigreeLitsRouter } from './lits-pedigree-router.js'
import { router as litterBoxLitsRouter } from './lits-litter-box-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))

router.use('/lits', litsRouter)

router.use('/pedigree-lits', pedigreeLitsRouter)

router.use('/litter-box-lits', litterBoxLitsRouter)
