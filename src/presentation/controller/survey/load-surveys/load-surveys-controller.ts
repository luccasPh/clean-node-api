import { LoadSurveys, Controller, HttpRequest, HttpResponse } from './load-surveys-controller-protocols'
import { serverError } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  private readonly loadSurveys: LoadSurveys

  constructor (LoadSurveys: LoadSurveys) {
    this.loadSurveys = LoadSurveys
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.loadSurveys.load()
      return await new Promise(resolve => resolve({
        statusCode: 200,
        body: 'any'
      }))
    } catch (error) {
      return serverError(error)
    }
  }
}
