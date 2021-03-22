import * as Yup from 'yup'

import { RequiredFieldsValidation } from '@/validation/validators'

interface SutTypes {
  sut: RequiredFieldsValidation
  schema: Yup.AnySchema
}

const makeSut = (): SutTypes => {
  const schema = Yup.object().shape({
    name: Yup.string().required('name is a required field'),
    email: Yup.string().required('email is a required field'),
    password: Yup.string().min(6, 'password minimum 6 characters'),
    passwordConfirmation: Yup.string().required('password confirmation is a required field')
  })
  const sut = new RequiredFieldsValidation(schema)
  return {
    sut,
    schema
  }
}

describe('RequiredFields Validation', () => {
  test('Should calls schema validation with correct values', () => {
    const { sut, schema } = makeSut()
    const isValidSpy = jest.spyOn(schema, 'isValid')
    const input = {
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password',
      passwordConfirmation: 'password'
    }
    sut.validate(input)
    expect(isValidSpy).toHaveBeenCalledWith(input)
  })
})
