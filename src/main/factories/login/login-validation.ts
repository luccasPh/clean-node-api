import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validation: Validation[] = []
  for (const field of ['name', 'email']) {
    validation.push(new RequiredFieldValidation(field))
  }
  validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validation)
}
