import MockDate from 'mockdate'

import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '@/data/usecases/load-survey-result/db-load-survey-result-protocols'
import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result'
import { SaveSurveyResultParams } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

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

const makeSurveyResultData = (): SaveSurveyResultParams => ({
  accountId: 'any_accountId',
  surveyId: 'any_surveyId',
  answer: 'any_answer',
  date: new Date()
})

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = makeSurveyResultData()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const surveyResultData = makeSurveyResultData()
    const promise = sut.save(surveyResultData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const surveyResultData = makeSurveyResultData()
    await sut.save(surveyResultData)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(() => {
      throw new Error()
    })
    const surveyResultData = makeSurveyResultData()
    const promise = sut.save(surveyResultData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = makeSurveyResultData()
    const surveyResult = await sut.save(surveyResultData)
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
})
