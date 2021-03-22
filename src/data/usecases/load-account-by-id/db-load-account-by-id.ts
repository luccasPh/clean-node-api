import { AccountModel, Decrypter, LoadAccountById, LoadAccountByIdRepository } from './db-load-account-by-id-protocols'

export class DbLoadAccountById implements LoadAccountById {
  private readonly decrypter: Decrypter
  private readonly loadAccountByIdRepository: LoadAccountByIdRepository

  constructor (decrypter: Decrypter, loadAccountByIdRepository: LoadAccountByIdRepository) {
    this.decrypter = decrypter
    this.loadAccountByIdRepository = loadAccountByIdRepository
  }

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    const accountId = await this.decrypter.decrypt(accessToken)
    if (accountId) {
      const account = await this.loadAccountByIdRepository.loadById(accountId, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
