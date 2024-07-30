# API de Vendas

## Descrição
A API de vendas é um sistema desenvolvido para gerenciar vendas, clientes, produtos, endereços e telefones. Este projeto utiliza AdonisJS v6 com Node.js para fornecer uma API robusta e escalável, facilitando a integração e o gerenciamento dos dados necessários.

## Funcionalidades

- **Gerenciamento de Clientes**: Criação, atualização, visualização e exclusão de clientes.

- **Gerenciamento de Produtos**: Criação, atualização, visualização e exclusão de produtos.

- **Gerenciamento de Vendas**: Registro de vendas com cálculo automático de valores totais.

- **Gerenciamento de Endereços**: Adição e atualização de endereços de clientes.

- **Gerenciamento de Telefones**: Adição e atualização de telefones de clientes.

- **Autenticação**: Registro, login e logout de usuários com gerenciamento de tokens de acesso.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando o framework AdonisJS versão 6, com o Kit inicial de API personalizado para criar servidores JSON API. Também utilizamos o ORM Lucid, que facilita a manipulação e consulta ao banco de dados e o Japa para a execução de testes funcionais. O banco de dados é o MySQL, configurado e gerenciado através do Docker. O projeto segue o padrão MVC(Model, view and controller), mas sem as views, pois o servidor responde apenas JSON.

- Node.js

- AdonisJS v6

- TypeScript

- MySQL

- Lucid (ORM)

- VineJS (para validação de dados das requisições)

- i18n (para internacionalização das mensagens em inglês e ou português)

- Japa (para testes funcionais)

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

3. Configure o arquivo .env ou rode o banco de dados MySQL com docker(o projeto já possui um docker compose com o MySQL configurado):
    
    ```
    docker compose up -d
    ```

4. Rode as migrações para configurar o banco de dados:

    ```
    node ace migration:run
    ```

5. Rode os semeadores(seeders) para inserir dados iniciais:

    ```
    node ace db:seed
    ```

## Uso

### Executando o Servidor

Para iniciar o servidor, use o comando:
    
    ```
    node ace serve --watch
    ```

### Executando testes funcionais

Para executar os testes, use o comando:
    
    ```
    node ace test --watch
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