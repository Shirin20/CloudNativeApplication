/**
 * Module for bootstrapping.
 *
 * @author Andrea Viola Caroline Åkesson
 * @version 2.0.0
 */

import { IoCContainer } from '../utils/IoCContainer.js'

// Import Lit model, repository and service
import { Lit } from '../models/lit.js'
import { LitRepository } from '../repositories/LitRepository.js'
import { LitService } from '../services/LitService.js'

// Import LitsController
import { LitsController } from '../controllers/api/lits-controller.js'

// Import LitsLitterBoxcontroller
import { LitsLitterBoxController } from '../controllers/api/lits-litter-box-controller.js'

// Import LitsPedigreeController
import { LitsPedigreeController } from '../controllers/api/lits-pedigree-controller.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

/* ====== REGISTER MEMBER RELATED ENTITIES ====== */
iocContainer.register('LitModelType', Lit, { type: true })

iocContainer.register('LitRepositorySingleton', LitRepository, {
  dependencies: [
    'LitModelType'
  ],
  singleton: true
})

iocContainer.register('LitServiceSingleton', LitService, {
  dependencies: [
    'LitRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('LitsController', LitsController, {
  dependencies: [
    'LitServiceSingleton'
  ]
})

iocContainer.register('LitsLitterBoxController', LitsLitterBoxController, {
  dependencies: [
    'LitServiceSingleton'
  ]
})

iocContainer.register('LitsPedigreeController', LitsPedigreeController, {
  dependencies: [
    'LitServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
