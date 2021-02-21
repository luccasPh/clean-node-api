import { MongoHelper as sut } from '@/infra/db/mongodb/helpers/mongo-helper.ts'

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
