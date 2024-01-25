/* eslint-disable jsdoc/require-jsdoc */
import { PedigreeService } from '../../src/services/PedigreeService.js'

export class PedigreeServiceMock extends PedigreeService {
  /**
   * Gets the pedigree for requested User.
   *
   * @param {object} req - Express request object.
   * @returns {object} pedigree information..
   */
  getUserFullPedigree (req) {
    return {
      user: req.user || 'Mrs. user',
      pedigreeOwner: req.pedigreeOwner || 'Mr. pedigreeOwner',
      isOwner: false, // this.user === this.pedigreeOwner,
      follows: false,
      lits: [
        { id: 1, text: 'Blubb from lit one', published: '2023.12.08 12.00' },
        { id: 2, text: 'Blubb from lit two', published: '2023.12.08 12.00' },
        { id: 3, text: 'Blubb from lit three', published: '2023.12.08 12.00' },
        { id: 4, text: 'Blubb from lit four', published: '2023.12.08 12.00' },
        { id: 5, text: 'Blubb from lit five', published: '2023.12.08 12.00' }
      ]
    }
  }
}
