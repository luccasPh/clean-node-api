import { HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-erros'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email.validator'
import { InvalidParamError } from '../errors/invalid-param-erros'
export class SignUpController implements Controller {
  private readonly emailValidatorStub: EmailValidator
  constructor (emailValidatorStub: EmailValidator) {
    this.emailValidatorStub = emailValidatorStub
  }

  handle (httpRequest: HttpRequest): any {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidatorStub.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
