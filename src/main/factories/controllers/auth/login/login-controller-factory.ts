import { LoginController } from '../../../../../presentation/controller/auth/login/login-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../../usecases/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(
    new LoginController(
      makeDbAuthentication(),
      makeLoginValidation()
    )
  )
}
