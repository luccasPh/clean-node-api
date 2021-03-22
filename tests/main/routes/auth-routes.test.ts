import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'

let accountCollection: Collection

describe('Auth Routes', () => {
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

  test('Should return 204 on signup success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'John Doe',
        email: 'foo@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .expect(204)
  })

  test('Should return 200 on login success', async () => {
    const password = await hash('password', 12)
    await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'foo@example.com',
        password: 'password'
      })
      .expect(200)
  })

  test('Should return 401 on login fails', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'foo@example.com',
        password: 'password'
      })
      .expect(401)
  })
})
