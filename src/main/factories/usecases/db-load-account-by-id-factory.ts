import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { DbLoadAccountById } from '@/data/usecases/load-account-by-id/db-load-account-by-id'
import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id'
import env from '@/main/config/env'

export const makeDbLoadAccountById = (): LoadAccountById => {
  const jwtAdapter = new JwtAdapter(env.jwtSecretKey)
  const accountRepository = new AccountMongoRepository()
  return new DbLoadAccountById(jwtAdapter, accountRepository)
}
