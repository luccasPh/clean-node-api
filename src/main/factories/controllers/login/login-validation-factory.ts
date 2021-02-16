import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import {
  EmailValidation,
  RequiredFieldValidation, ValidationComposite
} from '../../../../validation/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const validation: Validation[] = []
  for (const field of ['email', 'password']) {
    validation.push(new RequiredFieldValidation(field))
  }
  validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validation)
}
