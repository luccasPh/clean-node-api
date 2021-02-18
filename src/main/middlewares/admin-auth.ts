import { adapterMiddleware } from '@/main/adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middlewares-factory'

export const adminAuth = adapterMiddleware(makeAuthMiddleware('admin'))
