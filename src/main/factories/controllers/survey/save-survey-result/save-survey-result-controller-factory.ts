import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controller/survey/save-survey-result/save-survey-result-controller'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/db-save-account-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(
    new SaveSurveyResultController(
      makeDbLoadSurveyById(),
      makeDbSaveSurveyResult()
    )
  )
}
