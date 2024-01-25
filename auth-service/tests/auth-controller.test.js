import { AccountController } from '../src/controllers/api/account-controller.js'
import { User } from '../src/models/user.js'
import jwt from 'jsonwebtoken'

// Mock the User model and jsonwebtoken
jest.mock('../src/models/user.js', () => ({
  User: {
    authenticate: jest.fn()
  }
}))
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}))
describe('AccountController', () => {
  let accountController
  let mockRequest
  let mockResponse
  let nextFunction
  beforeAll(() => {
    process.env.ACCESS_TOKEN_PRIVATE = process.env.ACCESS_TOKEN_SECRET
  })
  beforeEach(() => {
    // Instantiate the AccountController
    accountController = new AccountController()
    // Mock request and response
    mockRequest = {
      body: { username: 'testUser', password: 'password123' }
    }
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
    nextFunction = jest.fn()
  })
  it('should authenticate user and return a token on successful login', async () => {
    // Mock User.authenticate to return a user object
    User.authenticate.mockResolvedValue({
      id: '123',
      username: 'testUser',
      email: 'test@example.com',
      favoriteCat: 'Tabby'
    })
    // Mock jwt.sign to return a token
    jwt.sign.mockReturnValue('mockedToken')
    await accountController.login(mockRequest, mockResponse, nextFunction)
    // Expectations
    expect(User.authenticate).toHaveBeenCalledWith('testUser', 'password123')
    expect(jwt.sign).toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith({ access_token: 'mockedToken' })
  })
})
