import MockDate from 'mockdate'

import { InvalidParamError, ServerError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { LoadSurveyById, SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from './survey/load-survey-result/load-survey-result-controller-protocols'
import { SurveyModel } from '@/presentation/controller/survey/load-surveys/load-surveys-controller-protocols'
import { SaveSurveyResultController } from '@/presentation/controller/survey/save-survey-result/save-survey-result-controller'

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

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
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

  return new SaveSurveyResultStub()
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey_id'
  },
  body: {
    answer: 'valid_answer'
  },
  accountId: 'account_id'
})

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
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

  test('Should returns 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'survey_id'
      },
      body: {
        answer: 'wrong_answer'
      },
      accountId: 'account_id'
    })
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('answer'))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'survey_id',
      accountId: 'account_id',
      answer: 'valid_answer',
      date: new Date()
    })
  })

  test('Should returns 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should returns 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
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
  })
})
