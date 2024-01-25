/**
 * @file Defines the PedigreeService class.
 * @module services/PedigreeService
 * @version 1.0.0
 * @author Ragdoll
 */
import { DateTrimmer } from '../config/DateTrimmer.js'
import { UserError } from '../custom-error/userError.js'
/**
 * Module for PedigreeService.
 */
export class PedigreeService {
  /**
   * Gets the pedigree for the logged in user.
   *
   * @param {object} req - Express request object.
   * @returns {object} pedigree information..
   */
  async getUserFullPedigree (req) {
    if (!req.session.user || !req.session.user.followedUsers) {
      const pedigree = await this.#getUserPedigree(req)
      console.log('Loading user pedigree: ')

      req.session.user = {
        id: pedigree.userId,
        username: pedigree.username,
        favoriteCat: pedigree.favoriteCat,
        followedUsers: pedigree.followedUsers
      }
    }
    const userLits = await this.#getUserLits(req)

    return {
      user: req.session.user?.username || null,
      isOwner: true,
      favoriteCat: req.session.user?.favoriteCat,
      lits: userLits
    }
  }

  /**
   * Searches for user in auth service.
   *
   * @param {object} req - Express request object.
   * @returns {Promise} unresolved user
   */
  async search (req) {
    const response = await fetch(`${process.env.AUTH_SEARCH_STRING}/${req.body.username}`)

    if (response.status === 404) {
      throw new UserError('No user with that username exists')
    } else if (!response.ok) {
      throw new UserError('Something went wrong when fetching user')
    }
    return response.json()
  }

  /**
   * Gets the pedigree for requested user.
   *
   * @param {object} req - Express request object.
   * @returns {object} pedigree information.
   */
  async getSearchedUserFullPedigree (req) {
    const response = await fetch(`${process.env.LITS_BASE_URL}/pedigree-lits/${req.searchedUser.username}`)

    if (!response.ok) {
      throw new UserError('Something went wrong with the search. Please try again later.')
    }

    const rawLits = await response.json()
    const dateTrimmer = new DateTrimmer()

    return {
      user: req.session.user?.username || null,
      favoritecat: req.session.user?.favoriteCat,
      pedigreeOwner: req.searchedUser || 'Mr. pedigree-owner',
      pedigreeId: req.searchedUser?.userId || null,
      follows: req.session.user?.followedUsers?.includes(req.searchedUser.id),
      isOwner: req.session.user?.username === req.searchedUser.username,
      lits: dateTrimmer.trimLits(rawLits)
    }
  }

  /**
   * Sends a request to pedigree service to add an user to the logged in users follows list..
   *
   * @param {object} req - Express request object.
   * @returns {object} pedigree information..
   */
  async addToFollows (req) {
    const response = await fetch(`${process.env.PEDIGREE_BASE_URL}/pedigree/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${req.session.accessToken}`
      },
      body: JSON.stringify({
        followedUserId: req.params.id
      })
    })

    if (!response.ok) {
      throw new UserError('Something went wrong when adding the user.')
    }
    await this.#updatefollowedUsers(req)
    return response.json()
  }

  /**
   * Sends a request to pedigree service to remove an user to the logged in users follows list..
   *
   * @param {object} req - Express request object.
   * @returns {object} pedigree information..
   */
  async removeFromFollows (req) {
    const response = await fetch(`${process.env.PEDIGREE_BASE_URL}/pedigree/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${req.session.accessToken}`
      },
      body: JSON.stringify({
        followedUserId: req.params.id
      })
    })

    if (!response.ok) {
      throw new UserError('Something went wrong when removing the user.')
    }
    await this.#updatefollowedUsers(req)
    return response.json()
  }

  /**
   * Get user pedigree.
   *
   * @param {object} req - Express request object.
   * @returns {object[]} lits.
   */
  async #getUserPedigree (req) {
    const response = await fetch(`${process.env.PEDIGREE_BASE_URL}/pedigree/followed-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${req.session.accessToken}`
      }
    })

    if (!response.ok && response.status === 400) {
      throw new UserError('User pedigree could not be loaded.')
    }

    if (response.status === 403) {
      throw new UserError('Only logged in users can see their pedigree.')
    }
    return response.json()
  }

  /**
   * Gets lits.
   *
   * @param {object} req - Express request object.
   * @returns {object[]} lits.
   */
  async #getUserLits (req) {
    const response = await fetch(`${process.env.LITS_BASE_URL}/pedigree-lits`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${req.session.accessToken}`
      }
    })

    if (!response.ok) {
      throw new UserError('Something went wrong when loading user lits.')
    }
    const rawLits = await response.json()

    const dateTrimmer = new DateTrimmer()
    return dateTrimmer.trimLits(rawLits)
  }

  /**
   * Updates session.user.followedUsers after adding/removing users to follows.
   *
   * @param {req} req - Express request object.
   */
  async #updatefollowedUsers (req) {
    // update req.user
    const loggedInUser = await this.#getUserPedigree(req)
    req.session.user.followedUsers = loggedInUser.followedUsers
  }
}
