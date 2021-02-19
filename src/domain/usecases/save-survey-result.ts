import { SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResultModel {
  surveyId: string
  accountId: string
  answer: string
  data: Date
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
