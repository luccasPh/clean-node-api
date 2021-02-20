import { loginPath, signUpPath, surveyResultPath, surveysPath } from './paths'
import { badRequest, unauthorized, serverError, forbidden } from './components'
import {
  loginSchema,
  errorSchema,
  surveyAnswerSchema,
  surveySchema,
  surveyListSchema,
  apiKeyAuthSchema,
  tokenSchema,
  signUpSchema,
  addSurveySchema,
  saveSurveyResultSchema,
  surveyResultSchema,
  surveyResultAnswerSchema
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.0'
  },

  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  },

  servers: [{
    url: '/api'
  }],

  tags: [{
    name: 'Auth'
  }, {
    name: 'Survey'
  }],

  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveysPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },

  schemas: {
    login: loginSchema,
    signup: signUpSchema,
    token: tokenSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyList: surveyListSchema,
    surveyAnswer: surveyAnswerSchema,
    addSurvey: addSurveySchema,
    saveSurveyResult: saveSurveyResultSchema,
    saveSurveyResultAnswer: surveyResultAnswerSchema,
    surveyResult: surveyResultSchema
  },

  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    forbidden
  }

}
