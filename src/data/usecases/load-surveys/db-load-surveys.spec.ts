import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-survey-repository'
import { SurveyModel } from '../../../domain/models/survey'

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[] | null> {
      return await new Promise(resolve => resolve([{
        id: 'valid_id',
        question: 'valid_question',
        answers: [{
          image: 'valid_image',
          answer: 'valid_answer'

        }],
        date: new Date()
      }]))
    }
  }
  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys Usecase', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual([{
      id: 'valid_id',
      question: 'valid_question',
      answers: [{
        image: 'valid_image',
        answer: 'valid_answer'

      }],
      date: new Date()
    }])
  })

  // test('Should return null if LoadSurveysRepository return null', async () => {
  //   const { sut, loadSurveysRepositoryStub } = makeSut()
  //   jest.spyOn(loadSurveysRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
  //   const account = await sut.load('any_token', 'any_role')
  //   expect(account).toBeNull()
  // })

  // test('Should throw if Decrypter throws', async () => {
  //   const { sut, decrypterStub } = makeSut()
  //   jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const promise = sut.load('any_token', 'any_role')
  //   await expect(promise).rejects.toThrow()
  // })

  // test('Should throw if LoadSurveysRepository throws', async () => {
  //   const { sut, loadSurveysRepositoryStub } = makeSut()
  //   jest.spyOn(loadSurveysRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const promise = sut.load('any_token', 'any_role')
  //   await expect(promise).rejects.toThrow()
  // })
})
