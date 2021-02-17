import { Controller, Validation, HttpRequest, HttpResponse } from '../../../protocols'

export class AddSurveyController implements Controller {
  private readonly validation: Validation

  constructor (validation: Validation) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest)
    return await new Promise(resolve => resolve({
      statusCode: 400,
      body: 'any'
    }))
  }
}
