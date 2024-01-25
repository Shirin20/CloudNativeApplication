import { PedigreeController } from '../src/controllers/PedigreeController.js'
import { PedigreeServiceMock } from './mock-classes/PedigreeServiceMock.js'
import { req, res, next } from './mock-objects/requestCycleObjects.js'

const controller = new PedigreeController(new PedigreeServiceMock())

describe('Pedigree controller constructor', () => {
  test('Constructor should return instance of class PedigreeController', () => {
    expect(controller).toBeInstanceOf(PedigreeController)
  })
})

describe('getUserPedigree method.', () => {
  test('getUserPedigree method should call res.render with path: pedigree/logged-in-user', async () => {
    await controller.getUserPedigree(req, res, next)
    expect(res.path).toBe('pedigree/logged-in-user')
  })
})

describe('showSearch method.', () => {
  test('showSearch method should call res.render with path: pedigree/search', async () => {
    await controller.showSearch(req, res, next)
    expect(res.path).toBe('pedigree/search')
  })
})
