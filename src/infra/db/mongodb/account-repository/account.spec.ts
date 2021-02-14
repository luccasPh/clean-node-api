import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL)
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('John Doe')
    expect(account.email).toBe('foo@example.com')
    expect(account.password).toBe('password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    const account = await sut.loadByEmail('foo@example.com')
    expect(account).toBeTruthy()
    if (account) {
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('John Doe')
      expect(account.email).toBe('foo@example.com')
      expect(account.password).toBe('password')
    }
  })
})
