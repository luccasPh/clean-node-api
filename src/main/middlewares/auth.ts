import { adapterMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlewares-factory'

export const auth = adapterMiddleware(makeAuthMiddleware())
