import * as Yup from 'yup'

import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldsValidation, ValidationComposite } from '@/validation/validators'
import { makeAddSurveyValidation } from '@/main/factories/controllers/survey/add-survey/add-survey-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const schema = Yup.object().shape({
      question: Yup.string().required('question'),
      answers: Yup.array().of(
        Yup.object().shape({
          answer: Yup.string().required('answer'),
          image: Yup.string().notRequired()
        })
      ).required('answers')
    })
    makeAddSurveyValidation(schema)
    const validation: Validation[] = []
    validation.push(new RequiredFieldsValidation(schema))
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
