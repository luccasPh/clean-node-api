import { HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-erros'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): any {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
