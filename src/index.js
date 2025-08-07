require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./db');
const routes = require('./routes');
const swaggerSpecs = require('./swagger');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'OpenTelemetry Test API Documentation',
  })
);

app.use('/', routes);

app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Banco conectado');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    process.exit(1);
  }
}

startServer();
