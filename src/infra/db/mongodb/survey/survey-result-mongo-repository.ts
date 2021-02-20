import { ObjectId } from 'mongodb'

import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })

    const surveyResult = await this.loadBySurveyId(data.surveyId)
    return surveyResult
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const surveyCollection = await MongoHelper.getCollection('surveys')

    const survey = await surveyCollection.findOne({ _id: new ObjectId(surveyId) })
    const surveyResultTotal = await surveyResultCollection.countDocuments({ surveyId: new ObjectId(surveyId) })

    const { question, date, answers } = survey as SurveyModel

    await Promise.all(
      answers.map(async (object) => {
        const count = await surveyResultCollection.countDocuments({
          $and: [
            { surveyId: new ObjectId(surveyId) },
            { answer: object.answer }
          ]
        })
        const percent = (count / surveyResultTotal) * 100
        Object.assign(object, {
          ...object, count, percent: parseInt(percent.toFixed(0))
        })
        return object
      })
    )

    const surveyResult = {
      surveyId,
      question,
      answers,
      date
    }
    return surveyResult as SurveyResultModel
  }
}
