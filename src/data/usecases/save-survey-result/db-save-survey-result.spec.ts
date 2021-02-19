import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve({
        id: 'valid_id',
        accountId: 'any_accountId',
        surveyId: 'any_surveyId',
        answer: 'any_answer',
        data: new Date()
      }))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'any_accountId',
  surveyId: 'any_surveyId',
  answer: 'any_answer',
  data: new Date()
})

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const surveyResultData = makeSurveyResultData()
    const promise = sut.save(surveyResultData)
    await expect(promise).rejects.toThrow()
  })
})
