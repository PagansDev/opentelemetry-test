# OpenTelemetry Test API

API REST desenvolvida com Express.js, Sequelize e MySQL para testes de instrumentação OpenTelemetry.

## Pré-requisitos

- Node.js 16+
- MySQL 8.0+
- npm

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

```env
SERVER_PORT=3000
MYSQL_PORT=3306
USER=seu_usuario
PASSWORD=sua_senha
DB_NAME=otel
```

4. Configure o banco de dados:

- Certifique-se de que o MySQL está rodando
- Execute o arquivo SQL para criar o banco e importar os dados:

```bash
mysql -u seu_usuario -p < database-otel-test-api.sql
```

Ou importe manualmente o arquivo `database-otel-test-api.sql` no seu cliente MySQL.

O arquivo SQL contém:

- Criação do banco de dados `otel`
- Criação das tabelas: `users`, `products`, `configs`
- Dados de exemplo (100+ produtos, usuários e configurações)

## Executar

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## OpenTelemetry e Jaeger

Para visualizar os traces e métricas:

1. Execute o Jaeger via Docker:

```bash
docker run --rm --name jaeger -p 16686:16686 -p 4317:4317 -p 4318:4318 -p 5778:5778 -p 9411:9411 cr.jaegertracing.io/jaegertracing/jaeger:2.8.0
```

2. Acesse o Jaeger UI em: `http://localhost:16686`

3. Selecione o serviço `opentelemetry-test-api` para visualizar os traces

O OpenTelemetry está configurado para enviar traces para o Jaeger na porta 4318.

## Estrutura do Projeto

```
src/
├── controllers/     # Lógica de negócio
├── models/         # Schemas das entidades
├── otel/          # Configuração OpenTelemetry
├── db.js          # Configuração do banco
├── index.js       # Servidor principal
├── routes.js      # Definição de rotas
└── swagger.js     # Configuração Swagger
```

## Banco de Dados

### Tabela `users`

- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(55), NOT NULL)
- `createdAt`, `updatedAt` (DATETIME)

### Tabela `products`

- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(55), NOT NULL)
- `price` (INT, NOT NULL)
- `description` (VARCHAR(255))
- `isAvailable` (TINYINT(1), DEFAULT 1)
- `deleted` (TINYINT(1), DEFAULT 0)
- `createdAt`, `updatedAt` (DATETIME)

### Tabela `configs`

- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `key` (VARCHAR(255))
- `value` (VARCHAR(255))
- `createdAt`, `updatedAt` (DATETIME)

## API Endpoints

### Status

- `GET /` - Status do servidor
- `GET /health` - Health check com verificação de banco

### Usuários

- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário

### Produtos

- `GET /api/products` - Listar produtos ativos
- `POST /api/products` - Criar produto
- `GET /api/products/performance-test` - Endpoint de teste de performance

### Métricas

- `GET /api/metrics/system` - Métricas do sistema (CPU, memória, etc.)

### Configurações

- `GET /api/configs` - Listar configurações
- `POST /api/configs` - Criar configuração

### Teste de Performance

O endpoint `/api/products/performance-test` possui comportamento dinâmico:

- **1ª chamada**: Resposta otimizada (rápida)
- **2ª chamada**: Processamento pesado (lenta)
- **3ª chamada**: Retorna 404 e reseta o contador

Endpoints auxiliares:

- `POST /api/products/performance-test/reset` - Resetar contador
- `GET /api/products/performance-test/status` - Status do contador

## Documentação

Acesse a documentação Swagger interativa em:
`http://localhost:3000/api-docs`

## Scripts

- `npm start` - Iniciar servidor
- `npm run dev` - Iniciar servidor (desenvolvimento)

## Configurações

- **Servidor**: Porta 3000 (configurável via `SERVER_PORT`)
- **MySQL**: Porta 3306 (configurável via `MYSQL_PORT`)
- **Timezone**: -03:00 (Brasil)
- **Logging**: Desabilitado para queries SQL
