// PedigreeController.test.js
import { PedigreeController } from '../src/controllers/api/pedigree-controller.js'
import { LinksService } from '../src/services/LinksService'
import { PedigreeService } from '../src/services/PedigreeService'

// At the top of your test file
jest.mock('../src/services/LinksService', () => {
  return {
    LinksService: jest.fn().mockImplementation(() => {
      return {
        createLink: jest.fn().mockImplementation(() => 'Mocked Link'),
        createPostLink: jest.fn().mockImplementation(() => 'Mocked Post Link')
      }
    })
  }
})

jest.mock('../src/services/PedigreeService', () => {
  return {
    PedigreeService: jest.fn().mockImplementation(() => {
      return {
        // Mock methods of PedigreeService as needed
      }
    })
  }
})

describe('PedigreeController', () => {
  let pedigreeController
  let mockRequest
  let mockResponse
  let nextFunction

  beforeEach(() => {
    // Create instances of mocked services
    const linksService = new LinksService()
    const pedigreeService = new PedigreeService()

    // Instantiate PedigreeController with mocked services
    pedigreeController = new PedigreeController(linksService, pedigreeService)

    // Set up mock request, response, and next function
    mockRequest = { /* Mock request properties */ }
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis() // Allows chaining of .status().json()
    }
    nextFunction = jest.fn()
  })

  it('should return links correctly in index method', async () => {
    await pedigreeController.index(mockRequest, mockResponse, nextFunction)

    // Verify that response status and json are called correctly
    expect(mockResponse.status).toHaveBeenCalledWith(201)
    expect(mockResponse.json).toHaveBeenCalledWith({ links: expect.any(Array) })

    // Verify next is not called with an error
    expect(nextFunction).not.toHaveBeenCalledWith(expect.any(Error))
  })
})
