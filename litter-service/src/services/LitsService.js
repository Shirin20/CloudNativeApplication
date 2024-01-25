/**
 * @file Defines the LitsService class.
 * @module services/LitsService
 * @version 1.0.0
 * @author Ragdoll
 */
import { DateTrimmer } from '../config/DateTrimmer.js'
import { UserError } from '../custom-error/userError.js'
/**
 * Module for Litsservice.
 */
export class LitsService {
  /**
   * Gets lits.
   *
   * @param {object} req - Express request object.
   * @returns {object[]} lits.
   */
  async getLits (req) {
    if (req.session.user.id && req.session.accessToken) {
      const response = await fetch(`${process.env.LITS_BASE_URL}/litter-box-lits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${req.session.accessToken}`
        },
        body: JSON.stringify({ followedUsers: req.session.user.followedUsers })
      })

      if (!response.ok) {
        throw new UserError('Something went wrong when loading the lits.')
      }

      const rawLits = await response.json()
      const dateTrimmer = new DateTrimmer()
      const lits = dateTrimmer.trimLits(rawLits.mergedAndSortedLits)

      return {
        mergedAndSortedLits: lits
      }
    } else {
      throw new UserError('Only logged in users can see the litter box.')
    }
  }

  /**
   * Create lit by calling lit-service create endpoint.
   *
   * @param {object} req - Express request object.
   * @returns {object} lit.
   */
  async create (req) {
    if (req.session.user.id && req.session.accessToken) {
      const preLit = {
        litText: req.body.lit,
        userId: req.session.user.id
      }
      const response = await fetch(`${process.env.LITS_BASE_URL}/lits/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${req.session.accessToken}`
        },
        body: JSON.stringify(preLit)
      })

      if (!response.ok) {
        throw new UserError('Something went wrong when creating the lit.')
      }
      console.log('New lit created')
      return response.json()
    } else {
      throw new UserError('The lit could not be created.')
    }
  }
}
