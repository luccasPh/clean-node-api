import { forbidden, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares/auth.middleware'
import { LoadAccountById, AccountModel } from '@/presentation/middlewares/auth.middleware-protocols'
import { JsonWebTokenError } from 'jsonwebtoken'

const makeLoadAccountById = (): LoadAccountById => {
  class LoadAccountByIdStub implements LoadAccountById {
    async load (accessToken: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve({
        id: 'valid_id',
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password'
      })
    }
  }
  return new LoadAccountByIdStub()
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByIdStub: LoadAccountById
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByIdStub = makeLoadAccountById()
  const sut = new AuthMiddleware(loadAccountByIdStub, role)
  return {
    sut,
    loadAccountByIdStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should calls LoadAccountById with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByIdStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByIdStub, 'load')
    await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('access_token', role)
  })

  test('Should returns 403 if LoadAccountById returns null', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should returns 200 if LoadAccountById returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should returns 401 if LoadAccountById throws a JsonWebTokenError', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'load').mockImplementationOnce(() => {
      throw new JsonWebTokenError('invalid token')
    })
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': 'access_token'
      }
    })
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should returns 500 if LoadAccountById throws', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'load').mockImplementationOnce(() => {
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
