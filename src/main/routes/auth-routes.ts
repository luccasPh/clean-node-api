/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

import { adapterRoute } from '@/main/adapters/express-route-adapter'
import { makeLoginController } from '@/main/factories/controllers/auth/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/auth/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignUpController()))
  router.post('/login', adapterRoute(makeLoginController()))
}
