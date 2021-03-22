import * as Yup from 'yup'

import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validation } from '@/presentation/protocols'
import {
  EmailValidation,
  RequiredFieldsValidation,
  ValidationComposite,
  CompareFieldValidation
} from '@/validation/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  const schema = Yup.object().shape({
    passwordConfirmation: Yup.string().required('passwordConfirmation'),
    password: Yup.string().required('password').min(6, 'password must be at least 6 characters'),
    email: Yup.string().required('email'),
    name: Yup.string().required('name')
  })
  const validation: Validation[] = []
  validation.push(new RequiredFieldsValidation(schema))
  validation.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validation)
}
