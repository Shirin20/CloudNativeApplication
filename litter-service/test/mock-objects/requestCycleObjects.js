/* eslint-disable jsdoc/require-jsdoc */
// mock req object, with necessary data in body
const req = {
  body: {
    username: 'username',
    email: 'email@email.com',
    password: 'password',
    favoriteCat: 'Garfield'
  },
  params: {
    test: 'test'
  },
  session: {
    flash: {},
    user: {
      id: ''
    }
  }
}

// mock res object, with function to set status, in order to test for the code of the response.
const res = {
  code: 500,
  status: (newCode) => {
    res.code = newCode
  },
  error: '',
  path: '',
  redirectedPath: '',
  data: {},
  render: (path, data = {}) => {
    res.path = path
    res.data = data
  },
  redirect: (path) => {
    res.redirectedPath = path
  }
}
// mock function for next - handling errors
function next (error = {}) {
  error.test = 'error function called'
}

export { req, res, next }
