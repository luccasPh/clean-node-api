import { JsonWebTokenError } from 'jsonwebtoken'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Middleware } from '@/presentation/protocols/middleware'
import { LoadAccountById, HttpRequest, HttpResponse } from './auth.middleware-protocols'

export class AuthMiddleware implements Middleware {
  private readonly loadAccountById: LoadAccountById
  private readonly role?: string

  constructor (loadAccountById: LoadAccountById, role?: string) {
    this.loadAccountById = loadAccountById
    this.role = role
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountById.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return unauthorized()
      } else {
        return serverError(error)
      }
    }
  }
}
