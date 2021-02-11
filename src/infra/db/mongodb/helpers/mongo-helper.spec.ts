import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await sut.connect(process.env.MONGO_URL)
    }
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongodb is dow', async () => {
    let accountCollection = await sut.getCollection('account')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('account')
    expect(accountCollection).toBeTruthy()
  })
})
