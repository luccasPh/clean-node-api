import { Validation } from '@/presentation/protocols'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  async validate (input: any): Promise<Error | null> {
    for (const validation of this.validations) {
      const error = await validation.validate(input)
      if (error) {
        return error
      }
    }
    return null
  }
}
