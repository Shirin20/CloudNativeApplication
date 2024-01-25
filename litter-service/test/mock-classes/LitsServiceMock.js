/* eslint-disable jsdoc/require-jsdoc */
import { LitsService } from '../../src/services/LitsService.js'

export class LitsServiceMock extends LitsService {
  /**
   * Gets lits.
   *
   * @param {object} req - Express request object.
   * @returns {object[]} lits.
   */
  async getLits (req) {
    return [{ littext: 'testText' }, { littext: 'testText' }]
  }

  /**
   * Create lit by calling lit-service create endpoint.
   *
   * @param {object} req - Express request object.
   * @returns {object} lit.
   */
  async create (req) {
    return { id: 'litId' }
  }
}
