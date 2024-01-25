/**
 * Module for the LitService.
 *
 * @author Ragdolls
 * @version 1.0.0
 */

import { MongooseServiceBase } from './MongooseServiceBase.js'
import { LitRepository } from '../repositories/LitRepository.js'

/**
 * Encapsulates a Lit service.
 */
export class LitService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {LitRepository} [repository=new LitRepository()] - A repository instantiated from a class with the same capabilities as LitRepository.
   */
  constructor (repository = new LitRepository()) {
    super(repository)
  }
}
