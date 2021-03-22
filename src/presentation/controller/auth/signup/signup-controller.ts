import { badRequest, forbidden, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { EmailInUseError } from '@/presentation/errors'
import { Authentication } from '@/presentation/controller/auth/login/login-controller-protocols'
import { HttpRequest, Controller, AddAccount, HttpResponse, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }

      await this.authentication.auth({
        email,
        password
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
