import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { mockInvalidProductData, mockProductData } from '#tests/mocks/mock_products'

test.group('Product create tests', () => {
  const endpoint = '/products/create'
  const successMessage = 'Product registered successfully.'

  test('create a new product successfully', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockProductData)

    // Assert
    response.assertStatus(201)
    assert.equal(response.body().message, successMessage)
    assert.exists(response.body().data)
  })

  test('create a new product with invalid data', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(endpoint)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidProductData)

    // Assert
    response.assertStatus(422)
  })

  test('create a new product without authentication', async ({ client }) => {
    // Act
    const response = await client.post(endpoint).json(mockProductData)

    // Assert
    response.assertStatus(401)
  })

  test('create a new product with invalid data without authentication', async ({ client }) => {
    // Act
    const response = await client.post(endpoint).json(mockInvalidProductData)

    // Assert
    response.assertStatus(401)
  })
})
