import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveyResult } from '@/data/usecases/load-survey-result/db-load-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey/survey-result-mongo-repository'
import { LoadSurveyResult } from '@/domain/usecases/survey/load-survey-result'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository
  )
}
