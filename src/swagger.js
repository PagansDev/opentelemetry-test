const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OpenTelemetry Test API',
      version: '1.0.0',
      description: 'API para testes de OpenTelemetry com MySQL e Sequelize',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário',
            },
            name: {
              type: 'string',
              description: 'Nome do usuário',
              maxLength: 55,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
          required: ['name'],
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do produto',
            },
            name: {
              type: 'string',
              description: 'Nome do produto',
              maxLength: 55,
            },
            price: {
              type: 'integer',
              description: 'Preço do produto',
            },
            description: {
              type: 'string',
              description: 'Descrição do produto',
              maxLength: 255,
            },
            isAvailable: {
              type: 'integer',
              description:
                'Disponibilidade do produto (1 = disponível, 0 = indisponível)',
              enum: [0, 1],
            },
            deleted: {
              type: 'integer',
              description: 'Status de exclusão (1 = deletado, 0 = ativo)',
              enum: [0, 1],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
          required: ['name', 'price'],
        },
        Config: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da configuração',
            },
            key: {
              type: 'string',
              description: 'Chave da configuração',
              maxLength: 255,
            },
            value: {
              type: 'string',
              description: 'Valor da configuração',
              maxLength: 255,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
          required: ['key'],
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
