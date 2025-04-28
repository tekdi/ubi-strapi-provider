// export default () => ({});

module.exports = {
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'UBA Provider API Documentation',
        description: 'Documentation for the UBA Provider Benefits API',
        contact: {
          name: 'UBA Provider team',
          email: 'team@example.com',
        },
      },
      security: [
        {
          bearerAuth: []
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      }
    },
  },
}; 