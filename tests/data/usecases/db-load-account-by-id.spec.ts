import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository'
import { AccountModel } from '@/data/usecases/add-account/db-account-protocols'
import { DbLoadAccountById } from '@/data/usecases/load-account-by-id/db-load-account-by-id'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string | null> {
      return await Promise.resolve('any_id')
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

interface SutTypes {
  sut: DbLoadAccountById
  decrypterStub: Decrypter
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const sut = new DbLoadAccountById(decrypterStub, loadAccountByIdRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByIdRepositoryStub
  }
}

describe('DbLoadAccountById Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_id', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return null if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_id', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByIdRepository with correct values', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.load('any_id', 'any_role')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id', 'any_role')
  })

  test('Should return null if LoadAccountByIdRepository return null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_id', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_id', 'any_role')
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load('any_id', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load('any_id', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
