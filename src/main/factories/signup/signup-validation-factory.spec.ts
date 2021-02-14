import { EmailValidation, RequiredFieldValidation, ValidationComposite, CompareFieldValidation } from '../../../presentation/helpers/validators'
import { makeSignUpValidation } from './signup-validation-factory'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidator } from '../../../presentation/protocols'

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
    makeSignUpValidation()
    const validation: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validation.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
