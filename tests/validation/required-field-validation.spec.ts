import * as Yup from 'yup'

import { RequiredFieldsValidation } from '@/validation/validators'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'

interface SutTypes {
  sut: RequiredFieldsValidation
  schema: Yup.AnySchema
}

const makeSut = (): SutTypes => {
  const schema = Yup.object().shape({
    anyField: Yup.string().required('anyField').min(6, 'anyField')
  })
  const sut = new RequiredFieldsValidation(schema)
  return {
    sut,
    schema
  }
}

describe('RequiredFields Validation', () => {
  test('Should calls schema validation with correct values', async () => {
    const { sut, schema } = makeSut()
    const isValidSpy = jest.spyOn(schema, 'validate')
    const input = {
      anyField: 'anyField'
    }
    await sut.validate(input)
    expect(isValidSpy).toHaveBeenCalledWith(input)
  })

  test('Should return a MissingParamError if schema validation fails', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({})
    expect(error).toEqual(new MissingParamError('anyField'))
  })

  test('Should return a InvalidParamError if schema validation fails', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ anyField: 'any' })
    expect(error).toEqual(new InvalidParamError('anyField'))
  })

  test('Should not return if validation succeeds', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ anyField: 'anyField' })
    expect(error).toBeFalsy()
  })
})
