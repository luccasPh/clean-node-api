export interface AddSurveyParams {
  question: string
  answers: Array<{
    image?: string
    answer: string
  }>
  date: Date
}

export interface AddSurvey {
  add: (survey: AddSurveyParams) => Promise<void>
}
