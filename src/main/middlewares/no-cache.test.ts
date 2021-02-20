import request from 'supertest'

import app from '@/main/config/app'
import { noCache } from './no-cache'

describe('NoCache Middleware', () => {
  test('Should disable cache', async () => {
    app.post('/test_no_cache', noCache, (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_no_cache')
      .expect('cache-control', 'no-stor, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
