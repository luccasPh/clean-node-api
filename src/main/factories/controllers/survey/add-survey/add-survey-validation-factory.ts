import * as Yup from 'yup'

import { RequiredFieldsValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'

export const makeAddSurveyValidation = (schema: Yup.AnySchema): ValidationComposite => {
  const validation: Validation[] = []
  validation.push(new RequiredFieldsValidation(schema))
  return new ValidationComposite(validation)
}
