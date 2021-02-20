import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

import swaggerDoc from '@/main/docs'

export default (app: Express): void => {
  app.use('/docs', serve, setup(swaggerDoc))
}
