/**
 * @file Defines the main application.
 * @module src/server
 * @author Ragdolls
 * @version 3.1.0
 */

// --------------------------------------------------------------------------
//
// Logging
//
import httpContext from 'express-http-context' // Must be first!
// --------------------------------------------------------------------------
import { container } from './config/bootstrap.js'
import { Consumer } from './rabbitmq/Consumer.js'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import http from 'http'
import session from 'express-session'
import { Server } from 'socket.io'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// import { connectToDatabase } from './config/mongoose.js'
import { sessionOptions } from './config/sessionOptions.js'
import { router } from './routes/router.js'
import redis from 'redis'
import connectRedis from 'connect-redis'
// --------------------------------------------------------------------------
//
// Logging
//
import { randomUUID } from 'node:crypto'
import { morganLogger } from './config/morgan.js'
import { logger } from './config/winston.js'
// --------------------------------------------------------------------------

try {
  // Connect to MongoDB.
  // await connectToDatabase(process.env.DB_CONNECTION_STRING)

  // Creates an Express application.
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server)

  const RedisStore = connectRedis(session) // Configure redis client
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  })

  app.set('container', container)

  // Get the directory name of this module's path.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
  app.set('layout extractScripts', true)
  app.set('layout extractStyles', true)
  app.use(expressLayouts)

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Setup and use session middleware (https://github.com/expressjs/session)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }

  app.use(session({
    store: new RedisStore({ client: redisClient }),
    ...sessionOptions
  }))

  // --------------------------------------------------------------------------
  //
  // Logging
  //
  // Add the request-scoped context.
  // NOTE! Must be placed before any middle that needs access to the context!
  //       See https://www.npmjs.com/package/express-http-context.
  app.use(httpContext.middleware)

  // Use a morgan logger.
  app.use(morganLogger)
  // --------------------------------------------------------------------------

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // --------------------------------------------------------------------------
    //
    // Logging
    //
    // Add a request UUID to each request and store information about
    // each request in the request-scoped context.
    req.requestUuid = randomUUID()
    httpContext.set('request', req)
    // --------------------------------------------------------------------------

    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Pass the base URL to the views.
    res.locals.baseURL = baseURL
    if (req.session.loggedIn) {
      res.locals.loggedIn = true
    }

    const consumer = new Consumer(io)

    // Start consuming RabbitMQ messages
    consumer.consumeMessages()

    next()
  })

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use((err, req, res, next) => {
    // --------------------------------------------------------------------------
    //
    // Logging
    //
    logger.error(err.message, { error: err })
    // --------------------------------------------------------------------------

    // 404 Not Found.
    if (err.status === 404) {
      res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
      return
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (process.env.NODE_ENV === 'production') {
      res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Render the error page.
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  // Starts the HTTP server listening for connections.
  server.listen(process.env.PORT, () => {
    // --------------------------------------------------------------------------
    //
    // Logging
    //
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info('Press Ctrl-C to terminate...')
    // --------------------------------------------------------------------------
  })
} catch (err) {
  // --------------------------------------------------------------------------
  //
  // Logging
  //
  logger.error(err.message, { error: err })
  // --------------------------------------------------------------------------
  process.exitCode = 1
}
