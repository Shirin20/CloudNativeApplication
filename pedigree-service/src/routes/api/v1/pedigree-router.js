/**
 * pedigree routes.
 *
 * @author Ragdoll
 * @version 1.0.0
 */

import express from 'express'
import { PedigreeController } from '../../../controllers/api/pedigree-controller.js'

export const router = express.Router()

const controller = new PedigreeController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/followers', controller.authenticateJWT, (req, res, next) => controller.getFollowers(req, res, next))
router.get('/followed-users', controller.authenticateJWT, (req, res, next) => controller.getFollowedUsers(req, res, next))
router.post('/', controller.authenticateJWT, (req, res, next) => controller.addNewFollower(req, res, next))

// delete a follower from a pedigreeChartOwnerPage through sending the follower id in the request object
router.delete('/', controller.authenticateJWT, (req, res, next) => controller.deleteFollowedUser(req, res, next))
