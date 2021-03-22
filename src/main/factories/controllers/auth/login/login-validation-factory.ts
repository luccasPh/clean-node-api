import * as Yup from 'yup'

import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validation } from '@/presentation/protocols'
import {
  EmailValidation,
  RequiredFieldsValidation, ValidationComposite
} from '@/validation/validators'

export const makeLoginValidation = (schema: Yup.AnySchema): ValidationComposite => {
  const validation: Validation[] = []
  validation.push(new RequiredFieldsValidation(schema))
  validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validation)
}
