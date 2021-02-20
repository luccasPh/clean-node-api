import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

import swaggerDoc from '@/main/docs'
import { noCache } from '../middlewares/no-cache'

export default (app: Express): void => {
  app.use('/docs', noCache, serve, setup(swaggerDoc))
}
