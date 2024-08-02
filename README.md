# API de Vendas

## Descrição
API de vendas é um sistema desenvolvido para gerenciar vendas, clientes, produtos, endereços e telefones. Este projeto utiliza AdonisJS v6 com Node.js para fornecer uma API robusta e escalável, facilitando a integração e o gerenciamento dos dados necessários.

## Funcionalidades

- **Gerenciamento de Clientes**: Criação, atualização, visualização e exclusão de clientes.

- **Gerenciamento de Produtos**: Criação, atualização, visualização e exclusão de produtos.

- **Gerenciamento de Vendas**: Registro de vendas com cálculo automático de valores totais.

- **Gerenciamento de Endereços**: Adição e atualização de endereços de clientes.

- **Gerenciamento de Telefones**: Adição e atualização de telefones de clientes.

- **Autenticação**: Registro, login e logout de usuários com gerenciamento de tokens de acesso.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando o framework AdonisJS versão 6, com o Kit inicial de API personalizado para criar servidores JSON API. O ORM escolhido foi o Lucid, que facilita a manipulação/consulta ao banco de dados e o Japa para a execução de testes funcionais. O banco de dados é o MySQL, configurado e gerenciado através do Docker. Também utilizamos o Redis para trabalhar com cache. O projeto segue o padrão MVC (Model, view and controller), mas sem as views, com a API retornando apenas JSON.

- Node.js

- AdonisJS v6

- TypeScript

- MySQL

- Lucid (ORM)

- Redis (para trabalhar com cache)

- VineJS (para validação de dados das requisições)

- i18n (para internacionalização das mensagens em inglês e ou português)

- Japa (para testes funcionais)

- Docker

## Instalação

1. Clone o repositório:

    ```
    git clone https://github.com/rafaelmagalhaesguedes/api-de-vendas.git
    cd api-de-vendas
    ```

2. Instale as dependências:
    
    ```
    npm install
    ```

3. Configure o arquivo .env com as seguintes variáveis ou use as configurações padrão fornecidas:

    ```properties
    TZ=UTC
    PORT=3333
    HOST=0.0.0.0
    LOG_LEVEL=info
    APP_KEY=_gIPEGEkdhGQZ6R1roAc0G8ZXo4V8BSW
    NODE_ENV=development
    DB_HOST=database
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=root
    DB_DATABASE=adonis_app
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=
    ```

4. Rode o banco de dados MySQL e o Redis com Docker (o projeto já possui um Docker Compose configurado):

    ```
    docker compose up -d
    ```

5. Rode as migrações para configurar o banco de dados:

    ```
    docker exec -it adonis_app node ace migration:run
    ```

6. Rode os semeadores (seeders) para inserir dados iniciais:

    ```
    docker exec -it adonis_app node ace db:seed
    ```

## Uso

### Executando o Servidor

Para iniciar o servidor, use o comando:
    
  ```
  docker exec -it adonis_app node ace serve --watch
  ```

**A aplicação estará disponível na porta** http://localhost:3333

### Executando testes funcionais

Para executar os testes, use o comando:
    
  ```
  docker exec -it adonis_app node ace test --watch
  ```

## Endpoints da API

### Autenticação

- POST /auth/signup
  - Registra um novo usuário.
  - Requer: Nome, email, senha.

- POST /auth/login
  - Faz login de um usuário e retorna um token de acesso.
  - Requer: Email, senha.

- DELETE /auth/logout
  - Faz logout do usuário atual.
  - Requer: Token de acesso no cabeçalho.

- GET /auth/me
  - Obtém as informações do usuário autenticado.
  - Requer: Token de acesso no cabeçalho.

### Usuários

- GET /users/details/:id
  - Obtém detalhes de um usuário específico.
  - Requer: Token de acesso no cabeçalho.

- PATCH /users/update/:id
  - Atualiza informações de um usuário específico.
  - Requer: Token de acesso no cabeçalho, informações a serem atualizadas.

- DELETE /users/delete/:id
  - Exclui um usuário específico.
  - Requer: Token de acesso no cabeçalho.

### Produtos

- GET /products/list
  - Obtém uma lista de produtos.
  - Requer: Token de acesso no cabeçalho.

- POST /products/create
  - Cria um novo produto.
  - Requer: Token de acesso no cabeçalho, dados do produto.

- GET /products/details/:id
  - Obtém detalhes de um produto específico.
  - Requer: Token de acesso no cabeçalho.

- PATCH /products/update/:id
  - Atualiza um produto específico.
  - Requer: Token de acesso no cabeçalho, dados a serem atualizados.

- DELETE /products/delete/:id
  - Exclui um produto específico.
  - Requer: Token de acesso no cabeçalho.

### Clientes

- GET /customers/list
  - Obtém uma lista de clientes.
  - Requer: Token de acesso no cabeçalho.

- POST /customers/create
  - Cria um novo cliente.
  - Requer: Token de acesso no cabeçalho, dados do cliente.

- GET /customers/details/:id
  - Obtém detalhes de um cliente específico.
  - Requer: Token de acesso no cabeçalho.

- PATCH /customers/update/:id
  - Atualiza um cliente específico.
  - Requer: Token de acesso no cabeçalho, dados a serem atualizados.

- DELETE /customers/delete/:id
  - Exclui um cliente específico.
  - Requer: Token de acesso no cabeçalho.

### Telefones

- POST /phones/create/:customerId
  - Adiciona um novo telefone a um cliente.
  - Requer: Token de acesso no cabeçalho, dados do telefone.

- PATCH /phones/update/:id/customer/:customerId
  - Atualiza um telefone específico de um cliente.
  - Requer: Token de acesso no cabeçalho, dados a serem atualizados.

- DELETE /phones/delete/:id/customer/:customerId
  - Exclui um telefone específico de um cliente.
  -Requer: Token de acesso no cabeçalho.

### Endereços

- POST /address/create/:customerId
  - Adiciona um novo endereço a um cliente.
  - Requer: Token de acesso no cabeçalho, dados do endereço.

- PATCH /address/update/:id/customer/:customerId
  - Atualiza um endereço específico de um cliente.
  - Requer: Token de acesso no cabeçalho, dados a serem atualizados.

- DELETE /address/delete/:id/customer/:customerId
  - Exclui um endereço específico de um cliente.
  - Requer: Token de acesso no cabeçalho.

### Vendas

- GET /sales/list
  - Obtém uma lista de vendas.
  - Requer: Token de acesso no cabeçalho.

- POST /sales/create
  - Cria uma nova venda.
  - Requer: Token de acesso no cabeçalho, dados da venda.

- GET /sales/details/:id
  - Obtém detalhes de uma venda específica.
  - Requer: Token de acesso no cabeçalho.

### Principais fluxos da aplicação

Os endpoints seguem um padrão de retorno que inclui dois campos principais: mensagem e dados. O campo mensagem contém a descrição da operação realizada, enquanto o campo dados fornece as informações retornadas pela API.

#### Autenticação

- **Login:**
  - **POST /auth/login**

  - Request Body:
    ```json
    {
      "email": "user@user.com",
      "password": "secret_user"
    }
    ```
  - Response:
    ```json
    {
      "message": "Login realizado com sucesso.",
      "token": "oat_NzI2MA.c2pFRzVjTnNzZDVkaGNVM21hVVJsQjkyQlRJdTRuZExINEhfUnhiUDI4ODU2NDIwMjM",
      "data": {
        "id": 2,
        "fullName": "User",
        "email": "user@user.com"
      }
    }
    ```

- **Registro de usuários:**
  - **POST /auth/signup**

  - Request Body:
    ```json
    {
      "fullName": "Rafael Guedes",
      "email": "rafael@email.com",
      "password": "minha_senha"
    }
    ```
  - Response:
    ```json
    {
      "message": "Usuário registrado com sucesso.",
      "data": {
        "fullName": "Rafael Guedes",
        "email": "rafael@email.com",
        "createdAt": "2024-07-30T14:47:45.043+00:00",
        "id": 548
      }
    }
    ```

#### Venda

- **Registrar uma venda:**
  - **POST /sales/create**

  - Request Body:
    ```json
    {
      "customerId": "2",
      "productId": "1",
      "quantity": "3"
    }
    ```

  - Response:
    ```json
    {
      "message": "Venda registrada com sucesso.",
      "data": {
        "customerId": 2,
        "productId": 1,
        "quantity": 3,
        "unitPrice": 100,
        "totalAmount": 300,
        "createdAt": "2024-07-30T14:54:01.807+00:00",
        "id": 146
      }
    }
    ```

- **Detalhes de uma venda:**
  - **POST /sales/details/id-da-venda**

  - Response:
    ```json
    {
      "message": "Detalhes da venda recuperados com sucesso.",
      "data": {
        "id": 146,
        "quantity": 3,
        "unitPrice": "100.00",
        "totalAmount": "300.00",
        "createdAt": "2024-07-30T14:54:01.807+00:00",
        "product": {
          "id": 1,
          "name": "Product 1",
          "description": "Description for product 1",
          "price": "100.00"
        },
        "customer": {
          "id": 2,
          "name": "User",
          "email": "user@user.com"
        }
      }
    }
    ```

#### Cliente

- **Registrar um cliente:**
  - **POST /sales/create**

  - Request Body:
    ```json
    {
      "name": "Cliente",
      "email": "cliente@email.com",
      "cpf": "000.000.000-00"
    }
    ```

  - Response:
    ```json
    {
      "message": "Cliente registrado com sucesso.",
      "data": {
        "name": "Cliente",
        "email": "cliente@email.com",
        "cpf": "000.000.000-00",
        "createdAt": "2024-07-30T14:57:27.547+00:00",
        "id": 1621
      }
    }
    ```

- **Registrar telefone do cliente:**
  - **POST /phones/create/id-do-cliente**

  - Request Body:
    ```json
    {
      "number": "00 99999 9999",
      "type": "Trabalho"
    }
    ```
    
  - Response:
    ```json
    {
      "message": "Telefone registrado com sucesso.",
      "data": {
        "number": "00 99999 9999",
        "type": "Trabalho",
        "customerId": 1,
        "createdAt": "2024-07-30T15:00:25.959+00:00",
        "updatedAt": "2024-07-30T15:00:25.959+00:00",
        "id": 453
      }
    }
    ```

- **Registrar endereço do cliente:**
  - **POST /address/create/id-do-cliente**

  - Request Body:
    ```json
    {
      "street": "Av. Santo Antônio",
      "number": "2",
      "complement": "Casa",
      "neighborhood": "Lourdes",
      "city": "Belo Horizonte",
      "state": "Minas Gerais",
      "zipCode": "12233333",
      "country": "Brasil"
    }
    ```

  - Response:
    ```json
    {
      "message": "Endereço registrado com sucesso.",
      "data": {
        "street": "Av. Santo Antônio",
        "number": "2",
        "complement": "Casa",
        "neighborhood": "Lourdes",
        "city": "Belo Horizonte",
        "state": "Minas Gerais",
        "zipCode": "12233333",
        "country": "Brasil",
        "customerId": 1,
        "createdAt": "2024-07-30T15:02:45.971+00:00",
        "updatedAt": "2024-07-30T15:02:45.971+00:00",
        "id": 163
      }
    }
    ```

- **Detalhes do cliente:**
  - **GET /customers/details/id-do-cliente**

  - Response:
    ```json
    {
      "message": "Detalhes do cliente recuperados com sucesso.",
      "data": {
        "id": 3,
        "name": "Cliente Teste",
        "cpf": "987.654.321-00",
        "email": "client2@client.com",
        "addresses": {
          "street": "Rua das Flores",
          "number": "123",
          "complement": "Apto 123",
          "neighborhood": "Centro",
          "city": "São Paulo",
          "state": "SP",
          "zipCode": "12345-678",
          "country": "Brasil"
        },
        "phones": [
          {
            "number": "00 999773 1234",
            "type": "Home"
          },
          {
            "number": "00 999773 1234",
            "type": "Mobile"
          }
        ],
        "sales": [
          {
            "quantity": 1,
            "unitPrice": "150.00",
            "totalAmount": "150.00",
            "createdAt": "2024-07-29T13:13:38.000+00:00",
            "product": {
              "name": "Product 2",
              "description": "Description for product 2",
              "price": "150.00"
            }
          }
        ]
      }
    }
    ```