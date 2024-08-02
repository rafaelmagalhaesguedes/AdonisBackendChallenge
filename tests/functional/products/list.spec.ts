import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Product list tests', () => {
  const endpoint = '/products/list'

  test('get a list of products with authentication', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client.get(endpoint).header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().data)
  })

  test('get a list of products without authentication', async ({ client }) => {
    // Act
    const response = await client.get(endpoint)

    // Assert
    response.assertStatus(401)
  })

  test('get a list of products with pagination', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .get(`${endpoint}?page=1&limit=1`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().data)
    assert.lengthOf(response.body().data, 1)
  })

  test('get a list of products with invalid pagination', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .get(`${endpoint}?page=99999999&limit=99999999`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().data)
    assert.isEmpty(response.body().data)
  })

  test('get a list of products with invalid token', async ({ client }) => {
    // Act
    const response = await client.get(endpoint).header('Authorization', `Bearer invalid_token`)

    // Assert
    response.assertStatus(401)
  })
})
