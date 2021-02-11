import { MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'foo@example.com',
    password: 'password'
  }
})
const makeSut = (): LoginController => {
  return new LoginController()
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.email = ''
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
