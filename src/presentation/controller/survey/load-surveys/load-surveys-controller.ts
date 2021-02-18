import { LoadSurveys, Controller, HttpRequest, HttpResponse } from './load-surveys-controller-protocols'
import { ok, serverError } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  private readonly loadSurveys: LoadSurveys

  constructor (LoadSurveys: LoadSurveys) {
    this.loadSurveys = LoadSurveys
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
