# Sales API

## Description

The Sales API is a system designed to manage sales, customers, products, addresses, and phone numbers. This project uses AdonisJS v6 with Node.js to provide a robust and scalable API, facilitating integration and management of the necessary data.

## Features

- **Customer Management:** Creation, updating, viewing, and deletion of customers.

- **Product Management:** Creation, updating, viewing, and deletion of products.

- **Sales Management:** Recording of sales with automatic total value calculation.

- **Address Management:** Addition and updating of customer addresses.

- **Phone Management:** Addition and updating of customer phone numbers.

- **Authentication:** User registration, login, and logout with access token management.

## Technologies Used

The project was developed using AdonisJS version 6, with a custom API starter kit to create JSON API servers. The chosen ORM is Lucid, which facilitates database manipulation/queries, and Japa for functional testing. The database is MySQL, configured and managed via Docker. Redis is also used for caching. The project follows the MVC (Model, View, and Controller) pattern, but without views, with the API returning only JSON.

- Node.js

- AdonisJS v6

- TypeScript

- MySQL

- Lucid (ORM)

- Redis (for caching)

- VineJS (for request data validation)

- i18n (for internationalization of messages in English and Portuguese)

- Japa (for functional testing)

- Docker

## Installation

1. Clone the repository:

    ```
    git clone https://github.com/rafaelmagalhaesguedes/AdonisBackendChallenge.git
    cd AdonisBackendChallenge
    ```

2. Install the dependencies:
    
    ```
    npm install
    ```

3. Configure the .env file with the following variables or feel free to modify:

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

4. Run the project with Docker (the project already has a Docker Compose setup for the backend, database, and Redis):
   
    ```
    docker compose up -d
    ```

5. Run migrations to set up the database:

    ```
    docker exec -it adonis_app node ace migration:run
    ```

6. Run seeders to insert initial data:

    ```
    docker exec -it adonis_app node ace db:seed
    ```

## Uso

The application will be available at http://localhost:3333

### Running Functional Tests

To run the tests, use the commands:

- Start the server inside the container:
    
  ```
  docker exec -it adonis_app node ace serve --watch
  ```
  
  - run the tests:
  ```
  docker exec -it adonis_app node ace test --watch
  ```

### Main Application Flows

The endpoints follow a response pattern that includes two main fields: message and data. The message field contains the description of the operation performed, while the data field provides the information returned by the API.

#### Authentication

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
      "message": "Login successful.",
      "token": "oat_NzI2MA.c2pFRzVjTnNzZDVkaGNVM21hVVJsQjkyQlRJdTRuZExINEhfUnhiUDI4ODU2NDIwMjM",
      "data": {
        "id": 2,
        "fullName": "User",
        "email": "user@user.com"
      }
    }
    ```

- **User registration:**
  - **POST /auth/signup**

  - Request Body:
    ```json
    {
      "fullName": "Rafael Guedes",
      "email": "rafael@email.com",
      "password": "my_password"
    }
    ```
  - Response:
    ```json
    {
      "message": "User registered successfully.",
      "data": {
        "fullName": "Rafael Guedes",
        "email": "rafael@email.com",
        "createdAt": "2024-07-30T14:47:45.043+00:00",
        "id": 548
      }
    }
    ```

#### Sales

- **Register a sale:**
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
      "message": "Sale recorded successfully.",
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

- **Sale details:**
  - **POST /sales/details/sale-id**

  - Response:
    ```json
    {
      "message": "Sale details retrieved successfully.",
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

#### Customer

- **Register a customer:**
  - **POST /sales/create**

  - Request Body:
    ```json
    {
      "name": "Customer",
      "email": "customer@email.com",
      "cpf": "000.000.000-00"
    }
    ```

  - Response:
    ```json
    {
      "message": "Customer registered successfully.",
      "data": {
        "name": "Customer",
        "email": "customer@email.com",
        "cpf": "000.000.000-00",
        "createdAt": "2024-07-30T14:57:27.547+00:00",
        "id": 1621
      }
    }
    ```

- **Register customer phone:**
  - **POST /phones/create/customer-id**

  - Request Body:
    ```json
    {
      "number": "00 99999 9999",
      "type": "Work"
    }
    ```
    
  - Response:
    ```json
    {
      "message": "Phone registered successfully.",
      "data": {
        "number": "00 99999 9999",
        "type": "Work",
        "customerId": 1,
        "createdAt": "2024-07-30T15:00:25.959+00:00",
        "updatedAt": "2024-07-30T15:00:25.959+00:00",
        "id": 453
      }
    }
    ```

- **Register customer address:**
  - **POST /address/create/customer-id**

  - Request Body:
    ```json
    {
      "street": "Av. Santo Antônio",
      "number": "2",
      "complement": "House",
      "neighborhood": "Lourdes",
      "city": "Belo Horizonte",
      "state": "Minas Gerais",
      "zipCode": "12233333",
      "country": "Brazil"
    }
    ```

  - Response:
    ```json
    {
      "message": "Address registered successfully.",
      "data": {
        "street": "Av. Santo Antônio",
        "number": "2",
        "complement": "House",
        "neighborhood": "Lourdes",
        "city": "Belo Horizonte",
        "state": "Minas Gerais",
        "zipCode": "12233333",
        "country": "Brazil",
        "customerId": 1,
        "createdAt": "2024-07-30T15:02:45.971+00:00",
        "updatedAt": "2024-07-30T15:02:45.971+00:00",
        "id": 163
      }
    }
    ```

- **Customer details:**
  - **GET /customers/details/customer-id**

  - Response:
    ```json
    {
      "message": "Customer details retrieved successfully.",
      "data": {
        "id": 3,
        "name": "Customer Teste",
        "cpf": "987.654.321-00",
        "email": "customer@customer.com",
        "addresses": {
          "street": "Av. Paulista",
          "number": "123",
          "complement": "House",
          "neighborhood": "São Paulo",
          "city": "São Paulo",
          "state": "SP",
          "zipCode": "12345-678",
          "country": "Brazil"
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
