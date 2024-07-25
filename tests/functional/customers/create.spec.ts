import { test } from '@japa/runner'
import { mockCustomerData, mockInvalidCustomerData } from '#tests/mocks/mock_customers'
import { loginAndGetToken } from '#tests/factories/auth_factory'

test.group('Customers create tests', () => {
  const endpoint = '/customers/create'

  test('should create a new customer', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockCustomerData)

    // Assert
    response.assertStatus(201)
    assert.equal(response.body().message, 'Customer registered successfully.')
    assert.exists(response.body().customer, 'Customer data should be returned')
  })

  test('should return an error when creating a customer with invalid data', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidCustomerData)

    // Assert
    response.assertStatus(422)
  })

  test('should return an error when creating a customer without authentication', async ({
    client,
  }) => {
    // Act
    const response = await client.post(endpoint).json(mockCustomerData)

    // Assert
    response.assertStatus(401)
  })
})
