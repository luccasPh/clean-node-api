import * as Yup from 'yup'

import { AddSurveyController } from '@/presentation/controller/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from './add-survey-db-factory'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const schema = Yup.object().shape({
    answers: Yup.array()
      .of(
        Yup.object().shape({
          answer: Yup.string().required('answer'),
          image: Yup.string().notRequired()
        })
      )
      .min(2, 'answers at least 2 options')
      .required('answers'),
    question: Yup.string().required('question')
  })
  return makeLogControllerDecorator(
    new AddSurveyController(
      makeAddSurveyValidation(schema),
      makeDbAddSurvey()
    )
  )
}
