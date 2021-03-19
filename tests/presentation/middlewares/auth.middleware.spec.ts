import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares/auth.middleware'
import { LoadAccountByToken, AccountModel } from '@/presentation/middlewares/auth.middleware-protocols'

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve({
        id: 'valid_id',
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password'
      })
    }
  }
  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should calls LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('access_token', role)
  })

  test('Should returns 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should returns 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should returns 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})