import { test } from '@japa/runner'
import {
  mockInvalidCustomerId,
  mockInvalidProductId,
  mockInvalidSalesData,
  mockSalesData,
} from '#tests/mocks/mock_sales'
import { loginAndGetToken } from '#tests/factories/auth_factory'

test.group('Sales create tests', () => {
  const endpoint = '/sales/create'

  test('should create a sale', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockSalesData)

    // Assert
    response.assertStatus(201)
    const responseBody = response.body()

    assert.exists(responseBody.sale, 'Sale object should exist in response')
    assert.exists(responseBody.sale.id, 'Sale ID should exist')
    assert.exists(responseBody.sale.quantity, 'Sale quantity should exist')
    assert.exists(responseBody.sale.totalAmount, 'Sale totalAmount should exist')
    assert.exists(responseBody.sale.saleDate, 'Sale saleDate should exist')
    assert.exists(responseBody.sale.product, 'Product object should exist in sale')
    assert.exists(responseBody.sale.customer, 'Customer object should exist in sale')

    assert.equal(responseBody.sale.product.id, 1, 'Product ID should match')
    assert.equal(responseBody.sale.customer.id, 1, 'Customer ID should match')
  })

  test('should return an error when creating a sale with invalid data', async ({
    client,
    assert,
  }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidSalesData)

    // Assert
    response.assertStatus(422)
    assert.exists(response.body().errors, 'Errors object should exist in response')
  })

  test('should return an error when creating a sale with an invalid product ID', async ({
    client,
    assert,
  }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidProductId)

    // Assert
    response.assertStatus(404)
    assert.equal(response.body().message, 'Row not found')
  })

  test('should return an error when creating a sale with an invalid customer ID', async ({
    client,
    assert,
  }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidCustomerId)

    // Assert
    response.assertStatus(404)
    assert.equal(response.body().message, 'Row not found')
  })
})
