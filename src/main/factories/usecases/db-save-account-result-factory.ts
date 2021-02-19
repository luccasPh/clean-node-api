import { SaveSurveyResult } from '@/domain/usecases/survey/save-survey-result'
import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultRepository)
}
