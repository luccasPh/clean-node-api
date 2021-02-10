import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(12)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with corr value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })
})
