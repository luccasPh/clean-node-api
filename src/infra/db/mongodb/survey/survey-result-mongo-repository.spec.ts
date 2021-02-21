import { Collection, ObjectId } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

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

  surveyResultCollection = await MongoHelper.getCollection('surveyResults')
  await surveyResultCollection.deleteMany({})

  accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image_1',
      answer: 'any_answer_1'
    }, {
      image: 'any_image_2',
      answer: 'any_answer_2'
    }, {
      image: 'any_image_3',
      answer: 'any_answer_3'
    }],
    date: new Date()
  })

  return MongoHelper.mapObject(res.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'John Doe',
    email: 'foo@example.com',
    password: 'password'
  })

  return MongoHelper.mapObject(res.ops[0])
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyResult Mongo Repository', () => {
  test('Should add survey result if its new', async () => {
    const survey = await makeSurvey()
    const account = await makeAccount()
    const sut = makeSut()
    await sut.save({
      surveyId: survey.id,
      accountId: account.id,
      answer: survey.answers[0].answer,
      date: new Date()
    })
    const surveyResult = await surveyResultCollection.findOne({
      surveyId: survey.id,
      accountId: account.id
    })
    expect(surveyResult).toBeTruthy()
  })

  test('Should update survey result if its not new', async () => {
    const survey = await makeSurvey()
    const account = await makeAccount()
    await surveyResultCollection.insertOne({
      surveyId: new ObjectId(survey.id),
      accountId: new ObjectId(account.id),
      answer: survey.answers[0].answer,
      date: new Date()
    })
    const sut = makeSut()
    await sut.save({
      surveyId: survey.id,
      accountId: account.id,
      answer: survey.answers[1].answer,
      date: new Date()
    })
    const surveyResult = await surveyResultCollection.find({
      surveyId: survey.id,
      accountId: account.id
    }).toArray()
    expect(surveyResult).toBeTruthy()
    expect(surveyResult.length).toBe(1)
  })

  test('Should load survey result', async () => {
    const survey = await makeSurvey()
    const account = await makeAccount()
    await surveyResultCollection.insertMany([{
      surveyId: new ObjectId(survey.id),
      accountId: new ObjectId(account.id),
      answer: survey.answers[0].answer,
      date: new Date()
    }, {
      surveyId: new ObjectId(survey.id),
      accountId: new ObjectId(account.id),
      answer: survey.answers[0].answer,
      date: new Date()
    }, {
      surveyId: new ObjectId(survey.id),
      accountId: new ObjectId(account.id),
      answer: survey.answers[1].answer,
      date: new Date()
    }, {
      surveyId: new ObjectId(survey.id),
      accountId: new ObjectId(account.id),
      answer: survey.answers[1].answer,
      date: new Date()
    }])
    const sut = makeSut()
    const surveyResult = await sut.loadBySurveyId(survey.id)
    console.log(surveyResult)
    expect(surveyResult).toBeTruthy()
    expect(surveyResult.surveyId).toEqual(survey.id)
    expect(surveyResult.answers[0].count).toBe(2)
    expect(surveyResult.answers[0].percent).toBe(50)
    expect(surveyResult.answers[1].count).toBe(2)
    expect(surveyResult.answers[1].percent).toBe(50)
    expect(surveyResult.answers[2].count).toBe(0)
    expect(surveyResult.answers[2].percent).toBe(0)
  })
})
