// import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
// import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
// import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
// import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
// import { SignUpController } from '../../../presentation/controller/signup/signup'
// import { Controller } from '../../../presentation/protocols'
// import { LogControllerDecorator } from '../../decorators/log'
// import { makeSignUpValidation } from './login-validation'

// export const makeSignUpController = (): Controller => {
//   const salt = 12
//   const bcryptAdapter = new BcryptAdapter(salt)
//   const accountRepository = new AccountMongoRepository()
//   const logRepository = new LogMongoRepository()
//   const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
//   const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())
//   return new LogControllerDecorator(signUpController, logRepository)
// }
