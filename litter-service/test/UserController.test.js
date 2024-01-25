import { UserController } from '../src/controllers/UserController.js'
import { UserServiceMock } from './mock-classes/UserServiceMock.js'
import { req, res, next } from './mock-objects/requestCycleObjects.js'

const controller = new UserController(new UserServiceMock())

describe('User controller constructor', () => {
  test('Constructor should return instance of class UserController', () => {
    expect(controller).toBeInstanceOf(UserController)
  })
})

describe('showRegister method.', () => {
  test('showRegister method should call res.render with path: user/register', async () => {
    await controller.showRegister(req, res, next)
    expect(res.path).toBe('user/register')
  })
})

describe('showLogin method.', () => {
  test('showLogin method should call res.render with path: user/login', async () => {
    await controller.showLogin(req, res, next)
    expect(res.path).toBe('user/login')
  })
})
