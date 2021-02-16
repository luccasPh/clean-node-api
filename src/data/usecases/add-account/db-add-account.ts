import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (
    hasher: Hasher,
    addAccountRepository: AddAccountRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
