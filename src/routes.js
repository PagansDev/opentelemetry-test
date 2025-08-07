const express = require('express');
const HealthController = require('./controllers/healthController');
const UserController = require('./controllers/userController');
const ProductController = require('./controllers/productController');
const ConfigController = require('./controllers/configController');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Status do servidor
 *     description: Retorna informações básicas sobre o servidor
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Servidor funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Servidor funcionando!
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', HealthController.getServerStatus);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Verifica o status de saúde do servidor e conexão com banco de dados
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Servidor saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *       500:
 *         description: Servidor com problemas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/health', HealthController.healthCheck);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuários
 *     description: Retorna todos os usuários cadastrados
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Criar usuário
 *     description: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *                 maxLength: 55
 *             required:
 *               - name
 *           example:
 *             name: João Silva
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/users', UserController.getAllUsers);
router.post('/api/users', UserController.createUser);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar produtos
 *     description: Retorna todos os produtos disponíveis (não deletados)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Criar produto
 *     description: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *                 maxLength: 55
 *               price:
 *                 type: integer
 *                 description: Preço do produto
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *                 maxLength: 255
 *               isAvailable:
 *                 type: integer
 *                 description: Disponibilidade do produto
 *                 enum: [0, 1]
 *                 default: 1
 *             required:
 *               - name
 *               - price
 *           example:
 *             name: Produto A
 *             price: 100
 *             description: Descrição do produto A
 *             isAvailable: 1
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/products', ProductController.getAllProducts);
router.post('/api/products', ProductController.createProduct);

/**
 * @swagger
 * /api/configs:
 *   get:
 *     summary: Listar configurações
 *     description: Retorna todas as configurações do sistema
 *     tags: [Configs]
 *     responses:
 *       200:
 *         description: Lista de configurações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Config'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Criar configuração
 *     description: Cria uma nova configuração
 *     tags: [Configs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: Chave da configuração
 *                 maxLength: 255
 *               value:
 *                 type: string
 *                 description: Valor da configuração
 *                 maxLength: 255
 *             required:
 *               - key
 *           example:
 *             key: app_name
 *             value: OpenTelemetry Test
 *     responses:
 *       201:
 *         description: Configuração criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/configs', ConfigController.getAllConfigs);
router.post('/api/configs', ConfigController.createConfig);

/**
 * @swagger
 * /api/products/performance-test:
 *   get:
 *     summary: Endpoint de teste de performance
 *     description: |
 *       Endpoint que simula diferentes cenários de performance:
 *       - 1ª chamada: Resposta otimizada (rápida)
 *       - 2ª chamada: Processamento pesado (lenta)
 *       - 3ª chamada: Retorna 404 (reset do contador)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de 1000 produtos (comportamento varia por chamada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 callNumber:
 *                   type: integer
 *                   description: Número da chamada atual
 *                 performance:
 *                   type: string
 *                   description: Tipo de performance aplicada
 *                 executionTime:
 *                   type: string
 *                   description: Tempo de execução
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Endpoint temporariamente indisponível (3ª chamada)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/products/performance-test', ProductController.performanceTest);

// Rotas extras para gerenciamento do contador (útil para testes)
/**
 * @swagger
 * /api/products/performance-test/reset:
 *   post:
 *     summary: Resetar contador do teste de performance
 *     description: Reseta o contador do endpoint de performance test
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Contador resetado com sucesso
 */
router.post('/api/products/performance-test/reset', (req, res) => {
  const result = ProductController.resetCounter();
  res.json(result);
});

/**
 * @swagger
 * /api/products/performance-test/status:
 *   get:
 *     summary: Status do contador do teste de performance
 *     description: Retorna o status atual do contador
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Status atual do contador
 */
router.get('/api/products/performance-test/status', (req, res) => {
  const status = ProductController.getCounterStatus();
  res.json(status);
});

module.exports = router;
