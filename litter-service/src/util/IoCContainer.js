/**
 * Inversion of COntrol container class.
 */
export class IoCContainer {
  /**
   * Two collections: One of services and one of single instances.
   *
   * @type {Map}
   */
  #services
  #singletons

  /**
   * Creates an instance of the class.
   */
  constructor () {
    this.#services = new Map()
    this.#singletons = new Map()
  }

  /**
   * Registers a service with the container.
   *
   * @param {string} name - ...
   * @param {*} definition - ...
   * @param {object} options - ...
   * @param {string[]} options.dependencies - ...
   * @param {boolean} options.singleton - ...
   */
  register (name, definition, { dependencies, singleton = false }) {
    this.#services.set(
      name,
      {
        definition,
        dependencies,
        singleton: !!singleton
      })
  }

  /**
   * Resolves a value or object by name.
   *
   * @param {string} name - ...
   * @returns {object} A service.
   */
  resolve (name) {
    const service = this.#services.get(name)

    if (!service.singleton) {
      return this.#createInstance(service)
    }

    if (!this.#singletons.has(name)) {
      const instance = this.#createInstance(service)
      this.#singletons.set(name, instance)
    }
    return this.#singletons.get(name)
  }

  /**
   * Creates an instance of the service.
   *
   * @param {object} service - ...
   * @returns {object} new service.
   */
  #createInstance (service) {
    const args = service.dependencies?.map((dependency) =>
      this.resolve(dependency)) || []
    // eslint-disable-next-line new-cap
    return new service.definition(...args)
  }
}
