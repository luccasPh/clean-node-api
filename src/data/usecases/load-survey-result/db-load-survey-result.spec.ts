import MockDate from 'mockdate'

import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

const makeLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
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
  return new LoadSurveyResultRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_surveyId')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load('any_surveyId')
    await expect(promise).rejects.toThrow()
  })

  // test('Should return SurveyResult on success', async () => {
  //   const { sut } = makeSut()
  //   const surveyResultData = makeSurveyResultData()
  //   const surveyResult = await sut.save(surveyResultData)
  //   expect(surveyResult).toEqual({
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
