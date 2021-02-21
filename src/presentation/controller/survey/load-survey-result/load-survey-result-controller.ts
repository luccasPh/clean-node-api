import { LoadSurveyResult } from '@/domain/usecases/survey/load-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  private readonly loadSurveyById: LoadSurveyById
  private readonly loadSurveyResult: LoadSurveyResult

  constructor (loadSurveyById: LoadSurveyById, loadSurveyResult: LoadSurveyResult) {
    this.loadSurveyById = loadSurveyById
    this.loadSurveyResult = loadSurveyResult
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      await this.loadSurveyResult.load(surveyId)
      return await Promise.resolve({
        statusCode: 200,
        body: 'any'
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
