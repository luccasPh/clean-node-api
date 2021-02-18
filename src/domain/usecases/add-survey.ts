export interface AddSurveyModel {
  question: string
  answers: Array<{
    image?: string
    answer: string
  }>
  date: Date
}

export interface AddSurvey {
  add: (account: AddSurveyModel) => Promise<void>
}
