import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validators'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error | null> {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [
    makeValidation(),
    makeValidation()
  ]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(Promise.resolve(new MissingParamError('field')))
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(Promise.resolve(new Error()))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(Promise.resolve(new MissingParamError('field')))
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('Should no return if validation succeeds', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
