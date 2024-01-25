/**
 * Module for LitRepository.
 *
 * @author Ragdolls
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { Lit } from '../models/lit.js'

/**
 * Encapsulates a LitRepository.
 */
export class LitRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {Lit} [model=Lit] - A class with the same capabilities as Lit model.
   */
  constructor (model = Lit) {
    super(model)
  }
}
