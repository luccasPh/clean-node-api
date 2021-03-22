import { AnySchema } from 'yup'

import { Validation } from '@/presentation/protocols'

export class RequiredFieldsValidation implements Validation {
  private readonly schema: AnySchema

  constructor (schema: AnySchema) {
    this.schema = schema
  }

  validate (input: any): Error | null {
    this.schema.isValid(input).catch(error => {
      console.log(error)
    })
    return null
  }
}
