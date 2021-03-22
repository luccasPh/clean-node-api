import { AuthMiddleware } from '@/presentation/middlewares/auth.middleware'
import { Middleware } from '@/presentation/protocols/middleware'
import { makeDbLoadAccountById } from '@/main/factories/usecases/db-load-account-by-id-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountById(), role)
}
