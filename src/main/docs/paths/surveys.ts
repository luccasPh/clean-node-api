export const surveysPath = {
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
      401: {
        $ref: '#/components/unauthorized'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },

  post: {
    security: [{
      apiKeyAuth: []
    }
    ],
    tags: ['Survey'],
    summary: 'Endpoint para criar uma enquete ',
    description: 'Apenas usuários com acesso de administrador',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurvey'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Sucesso'
      },
      401: {
        $ref: '#/components/unauthorized'
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
