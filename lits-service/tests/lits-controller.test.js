import { LitsController } from '../src/controllers/api/lits-controller.js'
import { LitService } from '../src/services/LitService.js'

// Mock the LitService
jest.mock('../src/services/LitService.js', () => {
  return {
    LitService: jest.fn().mockImplementation(() => {
      return {
        getById: jest.fn(),
        update: jest.fn()
      }
    })
  }
})
describe('LitsController', () => {
  let litsController
  let mockRequest
  let mockResponse
  let nextFunction
  let mockLitService

  beforeEach(() => {
    // Mocked service
    mockLitService = new LitService()
    // Instantiate LitsController with mocked service
    litsController = new LitsController(mockLitService)
    // Setup mock request, response, and next function
    mockRequest = { params: { id: 'mockId' }, body: { litText: 'mockText' } }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn()
    }
    nextFunction = jest.fn()
  })
  it('should update a lit item if it exists', async () => {
    // Simulate the lit item exists
    mockLitService.getById.mockResolvedValue({ id: 'mockId', litText: 'originalText' })
    await litsController.update(mockRequest, mockResponse, nextFunction)
    // Verify that the update method is called
    expect(mockLitService.update).toHaveBeenCalledWith('mockId', { litText: 'mockText' })
    // Verify response status code
    expect(mockResponse.status).toHaveBeenCalledWith(204)
    expect(mockResponse.end).toHaveBeenCalled()
  })
  it('should return a 404 status if the lit item does not exist', async () => {
    // Simulate the lit item does not exist
    mockLitService.getById.mockResolvedValue(null)
    await litsController.update(mockRequest, mockResponse, nextFunction)
    // Verify that the update method is not called
    expect(mockLitService.update).not.toHaveBeenCalled()
    // Verify response status code
    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.end).toHaveBeenCalled()
  })
})
