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

- Node.js

- AdonisJS v6

- TypeScript

- MySQL

- Lucid (ORM)

- i18n (para internacionalização)

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
