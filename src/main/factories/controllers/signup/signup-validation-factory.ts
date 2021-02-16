import { EmailValidation, RequiredFieldValidation, ValidationComposite, CompareFieldValidation } from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validation: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validation.push(new RequiredFieldValidation(field))
  }
  validation.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validation)
}
