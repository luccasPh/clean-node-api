import MockDate from 'mockdate'

import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyByIdRepository, LoadSurveyResultRepository, SurveyModel, SurveyResultModel } from './db-load-survey-result-protocols'

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

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve({
        id: 'valid_id',
        question: 'valid_question',
        answers: [{
          image: 'valid_image',
          answer: 'valid_answer_1'

        }, {
          image: 'valid_image',
          answer: 'valid_answer_2'

        }],
        date: new Date()
      })
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
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

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_surveyId')
    expect(surveyResult).toEqual({
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

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    await sut.load('any_surveyId')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.load('any_surveyId')
    expect(surveyResult).toEqual({
      surveyId: 'valid_id',
      question: 'valid_question',
      answers: [{
        image: 'valid_image',
        answer: 'valid_answer_1',
        count: 0,
        percent: 0
      }, {
        image: 'valid_image',
        answer: 'valid_answer_2',
        count: 0,
        percent: 0
      }],
      date: new Date()
    })
  })
})
