import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validation: Validation[] = []
  for (const field of ['question', 'answers']) {
    validation.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validation)
}
