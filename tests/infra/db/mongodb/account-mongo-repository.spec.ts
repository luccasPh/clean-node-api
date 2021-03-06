import { Collection, ObjectId } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

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
    accountCollection = await MongoHelper.getCollection('accounts')
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

  test('Should return an account on loadById without role', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    const accountId = result.ops[0]._id
    const account = await sut.loadById(accountId)
    expect(account).toBeTruthy()
    if (account) {
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('John Doe')
      expect(account.email).toBe('foo@example.com')
      expect(account.password).toBe('password')
    }
  })

  test('Should return an account on loadById with admin role', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password',
      role: 'admin'
    })
    const accountId = result.ops[0]._id
    const account = await sut.loadById(accountId, 'admin')
    expect(account).toBeTruthy()
    if (account) {
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('John Doe')
      expect(account.email).toBe('foo@example.com')
      expect(account.password).toBe('password')
    }
  })

  test('Should return null if on loadById fails', async () => {
    const sut = makeSut()
    const fakeId = new ObjectId().toHexString()
    const account = await sut.loadById(fakeId)
    expect(account).toBeNull()
  })

  test('Should return null on loadById with invalid role', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    const accountId = result.ops[0]._id
    const account = await sut.loadById(accountId, 'admin')
    expect(account).toBeFalsy()
  })

  test('Should return an account on loadById with if user is admin role', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password',
      role: 'admin'
    })
    const accountId = result.ops[0]._id
    const account = await sut.loadById(accountId)
    expect(account).toBeTruthy()
    if (account) {
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('John Doe')
      expect(account.email).toBe('foo@example.com')
      expect(account.password).toBe('password')
    }
  })
})
