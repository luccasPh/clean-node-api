import { loginPath } from './paths/login'
import { accountSchema } from './schemas/account'
import { loginSchema } from './schemas/login'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.0'
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
    account: accountSchema
  }

}
