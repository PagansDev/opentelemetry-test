# OpenTelemetry Test - Servidor com MySQL

Servidor Express.js com Sequelize e MySQL para testes de OpenTelemetry.

## 🚀 Configuração

### Pré-requisitos

- Node.js
- MySQL Server
- npm ou yarn

### Instalação

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=http://localhost/
PORT=3306
USER=seu_usuario
PASSWORD=sua_senha
DB_NAME=seu_banco
```

3. **Configurar banco de dados:**

- Certifique-se de que o MySQL está rodando
- Crie um banco de dados (ou ajuste o DB_NAME no .env)

4. **Executar o servidor:**

```bash
npm start
```

## 📊 Estrutura do Banco de Dados

### Tabela `users`

- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(55), NOT NULL)
- `createdAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `updatedAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### Tabela `products`

- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(55), NOT NULL)
- `price` (INT, NOT NULL)
- `description` (VARCHAR(255))
- `isAvailable` (TINYINT(1), DEFAULT 1)
- `deleted` (TINYINT(1), DEFAULT 0)
- `createdAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `updatedAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### Tabela `configs`

- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `key` (VARCHAR(255))
- `value` (VARCHAR(255))
- `createdAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `updatedAt` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

## 📚 Documentação da API

A API está documentada com Swagger/OpenAPI 3.0. Acesse a documentação interativa em:

**http://localhost:3000/api-docs**

## 🔌 Endpoints da API

### Health Check

- **GET** `/health` - Status do servidor e conexão com banco

### Users

- **GET** `/api/users` - Listar todos os usuários
- **POST** `/api/users` - Criar novo usuário
  ```json
  {
    "name": "Nome do Usuário"
  }
  ```

### Products

- **GET** `/api/products` - Listar produtos disponíveis (não deletados)
- **POST** `/api/products` - Criar novo produto
  ```json
  {
    "name": "Nome do Produto",
    "price": 100,
    "description": "Descrição opcional",
    "isAvailable": 1
  }
  ```

### Configs

- **GET** `/api/configs` - Listar todas as configurações
- **POST** `/api/configs` - Criar nova configuração
  ```json
  {
    "key": "chave_config",
    "value": "valor_config"
  }
  ```

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor
- `npm run dev` - Inicia o servidor (alias para start)

## 📚 Documentação Swagger

A documentação da API inclui:

- **Esquemas completos** para todos os modelos (User, Product, Config)
- **Exemplos de requisição** para todos os endpoints
- **Códigos de resposta** detalhados
- **Validações** e tipos de dados
- **Interface interativa** para testar a API

## 📝 Logs

O servidor registra automaticamente:

- Todas as requisições HTTP
- Conexão com banco de dados
- Sincronização de modelos
- Inserção de dados de exemplo

## 🔧 Configurações

- **Porta do servidor:** 3000 (configurável via variável de ambiente)
- **Porta do MySQL:** 3306 (fixa)
- **Timezone:** -03:00 (Brasil)
- **Logging:** Ativado para todas as queries SQL
