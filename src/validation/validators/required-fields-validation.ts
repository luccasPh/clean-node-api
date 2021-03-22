import { AnySchema } from 'yup'

import { Validation } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'

export class RequiredFieldsValidation implements Validation {
  private readonly schema: AnySchema

  constructor (schema: AnySchema) {
    this.schema = schema
  }

  async validate (input: any): Promise<Error | null> {
    try {
      await this.schema.validate(input)
      return null
    } catch (err) {
      if (err.type === 'required') {
        return new MissingParamError(err.errors[0])
      } else {
        return new InvalidParamError(err.errors[0])
      }
    }
  }
}
