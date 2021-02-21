import {
  LoadSurveyByIdRepository,
  LoadSurveyResult,
  LoadSurveyResultRepository,
  SurveyResultModel
} from './db-load-survey-result-protocols'

interface AnswerItems {
  image: string
  answer: string
  count: number
  percent: number
}

interface SurveyResultAnswers extends Array<AnswerItems > {

}
export class DbLoadSurveyResult implements LoadSurveyResult {
  private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository

  constructor (
    loadSurveyResultRepository: LoadSurveyResultRepository,
    loadSurveyByIdRepository: LoadSurveyByIdRepository) {
    this.loadSurveyResultRepository = loadSurveyResultRepository
    this.loadSurveyByIdRepository = loadSurveyByIdRepository
  }

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
    if (survey) {
      let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
      if (!surveyResult) {
        const { id, question, answers, date } = survey
        answers.map(object => {
          Object.assign(object, { ...object, count: 0, percent: 0 })
          return object
        })
        surveyResult = {
          surveyId: id,
          question,
          answers: answers as SurveyResultAnswers,
          date
        }
      }
      return surveyResult
    }
    return null
  }
}
