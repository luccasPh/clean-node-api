import * as Yup from 'yup'

import { Validation } from '@/presentation/protocols/validation'
import { EmailValidator } from '@/presentation/protocols'
import { makeLoginValidation } from '@/main/factories/controllers/auth/login/login-validation-factory'
import {
  RequiredFieldsValidation,
  EmailValidation,
  ValidationComposite
} from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorAdapter implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapter()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const schema = Yup.object().shape({
      password: Yup.string().required('password'),
      email: Yup.string().required('email')
    })
    makeLoginValidation(schema)
    const validation: Validation[] = []
    validation.push(new RequiredFieldsValidation(schema))
    validation.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
