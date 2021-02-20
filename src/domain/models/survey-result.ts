export interface SurveyResultModel {
  surveyId: string
  question: string
  answers: Array<{
    image: string
    answer: string
    count: number
    percent: number
  }>
  date: Date
}
