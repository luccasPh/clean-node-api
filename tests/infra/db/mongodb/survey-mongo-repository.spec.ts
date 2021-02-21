import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

let surveyCollection: Collection

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
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  test('Should add survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }],
      date: new Date()
    })
    const surveyFind = await surveyCollection.findOne({ question: 'any_question' })
    expect(surveyFind).toBeTruthy()
  })

  test('Should load all surveys on success', async () => {
    await surveyCollection.insertMany([{
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }],
      date: new Date()
    }, {
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }, {
        answer: 'other_answer'
      }],
      date: new Date()
    }])
    const sut = makeSut()
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(2)
    expect(surveys[0].id).toBeTruthy()
    expect(surveys[0].question).toBe('any_question')
    expect(surveys[1].question).toBe('other_question')
  })

  test('Should load empty list', async () => {
    const sut = makeSut()
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(0)
  })

  test('Should load survey by id on success', async () => {
    const res = await surveyCollection.insertMany([{
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }],
      date: new Date()
    }])
    const sut = makeSut()
    const survey = await sut.loadById(res.ops[0]._id)
    if (survey) {
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    }
  })
})
