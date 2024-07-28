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
    assert.exists(response.body().message, 'Message should exist in response')
    assert.equal(response.body().message, 'Sale registered successfully.')
    assert.exists(response.body().sale, 'Sale object should exist in response')
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
