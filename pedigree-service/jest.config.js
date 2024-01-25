// jest.config.js
export default {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  coverageProvider: 'v8',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/services/*.{js,jsx,ts,tsx}',
    'src/controllers/*.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: []
}
