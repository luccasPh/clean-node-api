export const loadSurvey = {
  get: {
    security: [{
      apiKeyAuth: []
    }
    ],
    tags: ['Survey'],
    summary: 'Endpoint para lista todas as enquetes',

    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyList'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
