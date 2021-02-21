/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from '@/main/config/env'
import app from '@/main/config/app'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL)
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 403 on add survey without accessToken', async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: 'Question 1',
        answers: [{
          image: 'https://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }]
      })
      .expect(403)
  })

  test('Should return 204 on add survey with valid accessToken', async () => {
    const account = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password',
      role: 'admin'
    })
    const id = account.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecretKey)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send({
        question: 'Question 1',
        answers: [{
          image: 'https://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }]
      })
      .expect(204)
  })

  test('Should return 403 on load surveys without accessToken', async () => {
    await request(app)
      .get('/api/surveys')
      .expect(403)
  })

  test('Should return 200 on load surveys with valid accessToken', async () => {
    const account = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    const id = account.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecretKey)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    await surveyCollection.insertMany([{
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }],
      date: new Date()
    }])
    await request(app)
      .get('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(200)
  })

  test('Should return 204 on load surveys with valid accessToken', async () => {
    const account = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    const id = account.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecretKey)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    await request(app)
      .get('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(204)
  })

  test('Should return 403 on save survey result without accessToken', async () => {
    await request(app)
      .put('/api/surveys/any_id/results')
      .send({
        answer: 'any_answer'
      })
      .expect(403)
  })

  test('Should return 200 on save survey result with accessToken', async () => {
    const account = await accountCollection.insertOne({
      name: 'John Doe',
      email: 'foo@example.com',
      password: 'password'
    })
    const id = account.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecretKey)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    const survey = await surveyCollection.insertMany([{
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }],
      date: new Date()
    }])
    await request(app)
      .put(`/api/surveys/${survey.ops[0]._id}/results`)
      .set('x-access-token', accessToken)
      .send({
        answer: 'any_answer'
      })
      .expect(200)
  })

  test('Should return 403 on load survey result without accessToken', async () => {
    await request(app)
      .get('/api/surveys/any_id/results')
      .expect(403)
  })
})
