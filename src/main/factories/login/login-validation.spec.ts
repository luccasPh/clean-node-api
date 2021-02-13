import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeLoginValidation } from './login-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidator } from '../../../presentation/protocols'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validation: Validation[] = []
    for (const field of ['name', 'email']) {
      validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
