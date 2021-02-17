/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adapterRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/auth/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/auth/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignUpController()))
  router.post('/login', adapterRoute(makeLoginController()))
}
