/**
 * Encapsulates a link service.
 */
export class LinksService {
  /**
   * Creates a link object for a given Express request, resource, HTTP method, and href.
   *
   * @function
   * @param {object} expressRequestObject - The Express request object.
   * @param {string} resource - The name of the resource the link points to (e.g., 'self', 'next', 'previous').
   * @param {string} method - The HTTP method for the link (e.g., 'GET', 'PUT', 'POST', 'DELETE').
   * @param {string} href - The relative path for the link's target, without the protocol and host.
   * @returns {object} An object containing the 'resource', 'HTTPMethod', and 'URL' properties for the link.
   */
  createLink (expressRequestObject, resource, method, href) {
    return {
      resource: `${resource}`,
      HTTPMethod: `${method}`,
      URL: `${expressRequestObject.protocol}://${expressRequestObject.get('host')}${expressRequestObject.baseUrl}/${href}`
    }
  }

  /**
   * Creates a link object for a given Express request, resource, HTTP method, and href.
   *
   * @function
   * @param {object} expressRequestObject - The Express request object.
   * @param {string} resource - The name of the resource the link points to (e.g., 'self', 'next', 'previous').
   * @returns {object} An object containing the 'resource', 'HTTPMethod', and 'URL' properties for the link.
   */
  createPostLink (expressRequestObject, resource) {
    return {
      resource: `${resource}`,
      HTTPMethod: 'POST',
      URL: `${expressRequestObject.protocol}://${expressRequestObject.get('host')}${expressRequestObject.baseUrl}`
    }
  }

  /**
   * Creates a link object for a given Express request, resource, HTTP method, and href.
   *
   * @function
   * @param {object} expressRequestObject - The Express request object.
   * @param {string} resource - The name of the resource the link points to (e.g., 'self', 'next', 'previous').
   * @param {object} requiredFields - RequiredFields when updating a resource.
   * @param {string} href - The relative path for the link's target, without the protocol and host.
   * @returns {object} An object containing the 'resource', 'HTTPMethod', and 'URL' properties for the link.
   */
  createUpdateLink (expressRequestObject, resource, requiredFields, href) {
    return {
      resource: `${resource}`,
      HTTPMethod: 'UPDATE',
      URL: `${expressRequestObject.protocol}://${expressRequestObject.get('host')}${expressRequestObject.baseUrl}/${href}`,
      RequiredFields: requiredFields
    }
  }

  /**
   * Creates a collection link object for a given Express request and HTTP method.
   *
   * @function
   * @param {object} expressRequestObject - The Express request object.
   * @returns {object} An object containing the 'resource', 'HTTPMethod', and 'href' properties for the self link.
   */
  createCollectionLink (expressRequestObject) {
    return {
      resource: 'Collection',
      HTTPMethod: 'GET',
      link: `${expressRequestObject.protocol}://${expressRequestObject.get('host')}${expressRequestObject.baseUrl}`
    }
  }
}
