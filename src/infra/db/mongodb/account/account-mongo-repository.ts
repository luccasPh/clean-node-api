import { ObjectId } from 'mongodb'

import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/usecases/authentication/db-authentication-protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByIdRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.mapObject(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return MongoHelper.mapObject(account)
  }

  async loadById (id: string, role?: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      _id: new ObjectId(id),
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return MongoHelper.mapObject(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}
