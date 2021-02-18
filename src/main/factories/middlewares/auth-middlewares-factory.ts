import { AuthMiddleware } from '@/presentation/middlewares/auth.middleware'
import { Middleware } from '@/presentation/protocols/middleware'
import { makeDbLoadAccountByToken } from '@/main/factories/usecases/db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
