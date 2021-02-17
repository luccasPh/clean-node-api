import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
import { badRequest, serverError } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  private readonly validation: Validation
  private readonly addSurvey: AddSurvey

  constructor (validation: Validation, addSurvey: AddSurvey) {
    this.validation = validation
    this.addSurvey = addSurvey
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })
      return await new Promise(resolve => resolve({
        statusCode: 400,
        body: 'any'
      }))
    } catch (error) {
      return serverError(error)
    }
  }
}
