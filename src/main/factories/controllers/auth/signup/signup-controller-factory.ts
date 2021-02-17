import { SignUpController } from '../../../../../presentation/controller/auth/signup/signup-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../../usecases/db-authentication-factory'
import { makeDbAddAccount } from './signup-db-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  return (makeLogControllerDecorator(
    new SignUpController(
      makeDbAddAccount(),
      makeSignUpValidation(),
      makeDbAuthentication()
    )
  ))
}
