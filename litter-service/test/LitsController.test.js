import { LitsController } from '../src/controllers/LitsController.js'
import { LitsServiceMock } from './mock-classes/LitsServiceMock.js'
import { req, res, next } from './mock-objects/requestCycleObjects.js'

const controller = new LitsController(new LitsServiceMock())

describe('Lits controller constructor', () => {
  test('Constructor should return instance of class LitsController', () => {
    expect(controller).toBeInstanceOf(LitsController)
  })
})

describe('index method.', () => {
  test('index method should call res.render with path: litter-box/index', async () => {
    req.session.user.id = true
    await controller.index(req, res, next)
    expect(res.path).toBe('litter-box/index')
  })
})

describe('createLit method.', () => {
  test('createLit method should call res.redirect with path: .', async () => {
    await controller.createLit(req, res, next)
    expect(res.redirectedPath).toBe('.')
  })
})
