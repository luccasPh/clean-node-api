import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

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

  test('Should return null if on loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('foo@example.com')
    expect(account).toBeNull()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    const accountInsert = result.ops[0]
    expect(accountInsert.accessToken).toBeFalsy()

    await sut.updateAccessToken(accountInsert._id, 'any_token')
    const accountFind = await accountCollection.findOne({ _id: accountInsert._id })
    expect(accountFind).toBeTruthy()
    expect(accountFind.accessToken).toBe('any_token')
  })

  test('Should return an account on loadByToken without role', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password',
      accessToken: 'any_token'
    })
    const account = await sut.loadByToken('any_token')
    expect(account).toBeTruthy()
    if (account) {
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('John Doe')
      expect(account.email).toBe('foo@example.com')
      expect(account.password).toBe('password')
    }
  })

  test('Should return an account on loadByToken with role', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password',
      accessToken: 'any_token',
      role: 'any_role'
    })
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeTruthy()
    if (account) {
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('John Doe')
      expect(account.email).toBe('foo@example.com')
      expect(account.password).toBe('password')
    }
  })

  test('Should return null if on loadByToken fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByToken('any_token')
    expect(account).toBeNull()
  })
})
