// client script to handle websockets
import '../socket.io/socket.io.js'

const base = document.querySelector('base')
const path = base ? (new URL('socket.io', base.href)).pathname : 'socket.io'

try {
  const socket = window.io.connect('/', { path })
  socket.on('message', async (message) => {
    if (await userFollows(message.userId)) {
      addLit(message)
    }
  })
  console.log('Websocket loaded successfully')
} catch (error) {
  console.log('Websocket could not be loaded, no live updates available')
}

/**
 * Fetches the followed users.
 *
 * @param {object} userId - userId of lit.
 * @returns {boolean} if current user follows user of lit.
 */
async function userFollows (userId) {
  const url = '/pedigree/followed-users'
  let userFollows = false
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('The followed users could not be fetched, live update of lits not available.')
    }
    const userInfo = await response.json()
    if (userInfo.followedUsers.includes(userId)) {
      userFollows = true
    }
    return userFollows
  } catch (error) {
    console.log(`An error occurred ${error.message}`)
  }
}

/**
 * Add lit.
 *
 * @param {*} message - The lit data for the view.
 */
function addLit (message) {
  const LitText = document.createTextNode(message.litText)
  const username = document.createTextNode(message.username)
  const publishedAt = document.createTextNode(message.createdAt)

  const litTemplate = document.querySelector('#lits-template')
  const litList = document.querySelector('.lits-container')

  // create form
  const form = document.createElement('form')
  form.action = 'pedigree/search'
  form.method = 'POST'

  const input = document.createElement('input')
  input.type = 'text'
  input.name = 'username'
  input.maxLength = '100'
  input.style = 'display: none'
  input.value = message.username

  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = 'Go to user pedigree'
  submitBtn.setAttribute('class', 'pedigree-link-btn')

  form.appendChild(input)
  form.appendChild(submitBtn)

  // use template
  if (litTemplate) {
    const lit = litTemplate.content.cloneNode(true)
    lit.id = 'added-lit'
    lit.querySelector('.lit-text').appendChild(LitText)
    lit.querySelector('.published-by b').appendChild(username)
    lit.querySelector('.published-at').appendChild(publishedAt)
    lit.querySelector('.pedigree-link').appendChild(form)

    litList.insertBefore(lit, litList.firstElementChild)
  }
}
