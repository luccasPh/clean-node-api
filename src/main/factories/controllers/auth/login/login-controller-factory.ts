import * as Yup from 'yup'

import { LoginController } from '@/presentation/controller/auth/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const schema = Yup.object().shape({
    password: Yup.string().required('password'),
    email: Yup.string().required('email')
  })
  return makeLogControllerDecorator(
    new LoginController(
      makeDbAuthentication(),
      makeLoginValidation(schema)
    )
  )
}
