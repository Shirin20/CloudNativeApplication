import { HomeController } from '../src/controllers/HomeController.js'
import { req, res, next } from './mock-objects/requestCycleObjects.js'

const controller = new HomeController()

describe('Home controller constructor', () => {
  test('Constructor should return instance of class HomeController', () => {
    expect(controller).toBeInstanceOf(HomeController)
  })
})

describe('index method.', () => {
  test('index method should call res.render with path: home/index', async () => {
    controller.index(req, res, next)
    expect(res.path).toBe('home/index')
  })
})
