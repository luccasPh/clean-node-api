import { badRequest } from '../../../helpers/http/http-helper'
import { Controller, Validation, HttpRequest, HttpResponse } from '../../../protocols'

export class AddSurveyController implements Controller {
  private readonly validation: Validation

  constructor (validation: Validation) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest)
    if (error) {
      return badRequest(error)
    }
    return await new Promise(resolve => resolve({
      statusCode: 400,
      body: 'any'
    }))
  }
}
