/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adapterMiddleware } from '../adapters/express-middleware-adapter'
import { adapterRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlewares-factory'

export default (router: Router): void => {
  const adminAuthMiddleware = adapterMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuthMiddleware, adapterRoute(makeAddSurveyController()))
}
