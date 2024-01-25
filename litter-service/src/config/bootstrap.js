/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'

import { HomeController } from '../controllers/HomeController.js'
import { UserController } from '../controllers/UserController.js'
import { PedigreeController } from '../controllers/PedigreeController.js'
import { LitsController } from '../controllers/LitsController.js'

import { UserService } from '../services/UserService.js'
import { PedigreeService } from '../services/PedigreeService.js'
import { LitsService } from '../services/LitsService.js'

const iocContainer = new IoCContainer()

iocContainer.register('UserService', UserService, {})
iocContainer.register('PedigreeService', PedigreeService, {})
iocContainer.register('LitsService', LitsService, {})

iocContainer.register('HomeController', HomeController, {
  // dependencies: [
  // ]
})

iocContainer.register('UserController', UserController, {
  dependencies: [
    'UserService'
  ]
})

iocContainer.register('PedigreeController', PedigreeController, {
  dependencies: [
    'PedigreeService'
  ]
})

iocContainer.register('LitsController', LitsController, {
  dependencies: [
    'LitsService'
  ]
})

export const container = Object.freeze(iocContainer)
