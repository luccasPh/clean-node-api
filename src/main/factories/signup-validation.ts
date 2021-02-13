import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-field-validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validation: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validation.push(new RequiredFieldValidation(field))
  }
  validation.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validation)
}
