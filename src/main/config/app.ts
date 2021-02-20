import express from 'express'

import setupSWagger from './swagger'
import setupMiddleware from './middlewares'
import setupRoutes from './routes'

const app = express()
setupSWagger(app)
setupMiddleware(app)
setupRoutes(app)
export default app
