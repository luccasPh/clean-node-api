import { loginPath } from './paths/login'
import { badRequest, unauthorized, serverError } from './components'
import { accountSchema, loginSchema, errorSchema } from './schemas'

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
  }],

  paths: {
    '/login': loginPath
  },

  schemas: {
    login: loginSchema,
    account: accountSchema,
    error: errorSchema
  },

  components: {
    badRequest,
    unauthorized,
    serverError
  }

}
