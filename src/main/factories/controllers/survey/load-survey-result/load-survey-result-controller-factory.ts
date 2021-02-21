import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/db-load-survey-by-id-factory'
import { LoadSurveyResultController } from '@/presentation/controller/survey/load-survey-result/load-survey-result-controller'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/db-load-survey-result-factory'

export const makeLoadSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(
    new LoadSurveyResultController(
      makeDbLoadSurveyById(),
      makeDbLoadSurveyResult()
    )
  )
}
