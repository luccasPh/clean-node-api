/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

import { auth } from '@/main/middlewares/auth'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { adapterRoute } from '@/main/adapters/express-route-adapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '../factories/controllers/survey/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adapterRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adapterRoute(makeLoadSurveysController()))
  router.put('/surveys/:surveyId/results', auth, adapterRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adapterRoute(makeLoadSurveyResultController()))
}
