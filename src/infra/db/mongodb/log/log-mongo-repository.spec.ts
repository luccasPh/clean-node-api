import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

describe('Log Mongo Repository', () => {
  let logCollection: Collection
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL)
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    logCollection = await MongoHelper.getCollection('logs')
    await logCollection.deleteMany({})
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await logCollection.countDocuments()
    expect(count).toBe(1)
  })
})
