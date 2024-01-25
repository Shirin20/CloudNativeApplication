/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-jsdoc */
/**
 * Module for the pedigreeController.
 *
 * @author Ragdoll
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { LinksService } from '../../services/LinksService.js'
import { PedigreeService } from '../../services/PedigreeService.js'

/**
 * Encapsulates a controller.
 */
export class PedigreeController {
  #linksService
  #pedigreeService

  /**
   * Initializes a new instance.
   *
   * @param {LinksService} linksService - A service instantiated from a class with the same capabilities as LinkService.
   * @param {PedigreeService} pedigreeService - A service instantiated from a class with the same capabilities as PedigreeService.
   */
  constructor (linksService = new LinksService(), pedigreeService = new PedigreeService()) {
    this.#linksService = linksService
    this.#pedigreeService = pedigreeService
  }

  /**
   * Authenticate the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticateJWT (req, res, next) {
    const authorization = req.headers.authorization?.split(' ')

    if (authorization?.[0] !== 'Bearer') {
      next(createError(401, 'Access token invalid or not provided.'))
      return
    }
    const publicKey = Buffer.from(process.env.ACCESS_TOKEN_PUBLIC, 'base64')
    try {
      req.jwt = jwt.verify(authorization[1], publicKey)
      req.user = {
        username: req.jwt.username,
        id: req.jwt.sub,
        favoriteCat: req.jwt.favoriteCat
      }
      next()
    } catch (err) {
      next(createError(403))
    }
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * The index.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const links = [
        this.#linksService.createLink(req, 'Self', 'GET', ''),
        this.#linksService.createLink(req, 'Followed users', 'GET', 'followed-users'),
        this.#linksService.createLink(req, 'Followers', 'GET', 'followers'),
        this.#linksService.createPostLink(req, 'Follow a user'),
        this.#linksService.createLink(req, 'Delete a followed user', 'DELETE', '')
      ]
      res.status(201).json({ links })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * Adds new follower.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getFollowers (req, res, next) {
    try {
      const userId = req.user.id

      const followers = await this.#pedigreeService.getUsersFollowers(userId)

      res.status(201).json({
        userId: userId,
        followers: followers,
        username: req.user.username,
        favoriteCat: req.user.favoriteCat
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  /**
   * Adds new follower.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getFollowedUsers (req, res, next) {
    try {
      const userId = req.user.id

      const followedUsers = await this.#pedigreeService.getUsersFollowedUsers(userId)

      res.status(201).json({
        userId: userId,
        followedUsers: followedUsers,
        username: req.user.username,
        favoriteCat: req.user.favoriteCat
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  /**
   * Adds new follower.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addNewFollower (req, res, next) {
    try {
      const followerId = req.user.id // ID of the signd in user that wants to follow other
      const followedUserId = req.body.followedUserId
      if (followerId === followedUserId) {
        return res.status(404).json({ message: 'A user cannot follow their self' })
      }
      await this.#pedigreeService.addFollower(followerId, followedUserId)
      await this.#pedigreeService.addFollowedUser(followerId, followedUserId)
      res.status(201).json({ message: 'New follower added successfully' })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * Delete a followed user from the followers followedUsers list and delete the follower from the followed users flowers list .
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteFollowedUser (req, res, next) {
    try {
      const followerId = req.user.id // ID of the follower
      const followedUserId = req.body.followedUserId
      await this.#pedigreeService.deleteFollowedUser(res, followerId, followedUserId)
      await this.#pedigreeService.deleteFollower(res, followerId, followedUserId)
      res.status(201).json({ message: 'the followed user was deleted successfully' })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}
