import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../presentation/protocols'
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite
} from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')

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
    for (const field of ['email', 'password']) {
      validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
