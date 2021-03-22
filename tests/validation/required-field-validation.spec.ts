import * as Yup from 'yup'

import { RequiredFieldsValidation } from '@/validation/validators'
import { MissingParamError } from '@/presentation/errors'

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
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password',
      passwordConfirmation: 'password'
    }
    await sut.validate(input)
    expect(isValidSpy).toHaveBeenCalledWith(input)
  })

  test('Should return a MissingParamError if schema validation fails', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({})
    expect(error).toEqual(new MissingParamError('anyField'))
  })
})
