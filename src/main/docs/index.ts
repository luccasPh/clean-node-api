import { loginPath } from './paths/login'
import { loadSurvey } from './paths/load-survey'
import { badRequest, unauthorized, serverError, forbidden } from './components'
import {
  accountSchema,
  loginSchema,
  errorSchema,
  surveyAnswerSchema,
  surveySchema,
  surveyListSchema,
  apiKeyAuthSchema
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
    '/surveys': loadSurvey
  },

  schemas: {
    login: loginSchema,
    account: accountSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyList: surveyListSchema,
    surveyAnswer: surveyAnswerSchema
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
