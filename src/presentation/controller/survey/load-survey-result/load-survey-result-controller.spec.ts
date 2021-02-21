import { LoadSurveyResult } from '@/domain/usecases/survey/load-survey-result'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import MockDate from 'mockdate'

import { LoadSurveyResultController } from './load-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  SurveyResultModel
} from './load-survey-result-controller-protocols'

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve({
        id: 'valid_id',
        question: 'valid_question',
        answers: [{
          image: 'valid_image',
          answer: 'valid_answer'

        }],
        date: new Date()
      })
    }
  }

  return new LoadSurveyByIdStub()
}

const makeLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve({
        surveyId: 'any_surveyId',
        question: 'an_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer',
          count: 10,
          percent: 8
        }, {
          image: 'any_image',
          answer: 'other_answer',
          count: 8,
          percent: 3
        }],
        date: new Date()
      })
    }
  }

  return new LoadSurveyResultStub()
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey_id'
  }
})

interface SutTypes {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const loadSurveyResultStub = makeLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('survey_id')
  })

  test('Should returns 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('surveyId'))
  })

  test('Should returns 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('survey_id')
  })

  // test('Should returns 500 if SaveSurveyResult throws', async () => {
  //   const { sut, saveSurveyResultStub } = makeSut()
  //   jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
  //     throw new Error()
  //   })
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse.statusCode).toBe(500)
  //   expect(httpResponse.body).toEqual(new ServerError())
  // })

  // test('Should returns 200 on success', async () => {
  //   const { sut } = makeSut()
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse.statusCode).toBe(200)
  //   expect(httpResponse.body).toEqual({
  //     surveyId: 'any_surveyId',
  //     question: 'an_question',
  //     answers: [{
  //       image: 'any_image',
  //       answer: 'any_answer',
  //       count: 10,
  //       percent: 8
  //     }, {
  //       image: 'any_image',
  //       answer: 'other_answer',
  //       count: 8,
  //       percent: 3
  //     }],
  //     date: new Date()
  //   })
  // })
})
