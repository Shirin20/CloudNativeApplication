/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // setupFilesAfterEnv: [
  //   'jest-extended/all',
  //   'jest-chain'
  // ],

  // Specify which files to show coverage for
  collectCoverageFrom: [
    'src/services/*.{js,jsx,ts,tsx}',
    'src/controllers/*.{js,jsx,ts,tsx}'

  ],

  // Excluding submodule woorden-api tests
  testPathIgnorePatterns: []
}
