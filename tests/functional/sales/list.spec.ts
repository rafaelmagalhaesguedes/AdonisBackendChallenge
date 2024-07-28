import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'

test.group('Sales list tests', () => {
  const endpoint = '/sales/list'

  test('ensure user can see sales list', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)
    // Act
    const response = await client.get(endpoint).header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    const { message, sales } = response.body()
    assert.equal(message, 'Sales list retrieved successfully.')
    assert.isArray(sales)
  })

  test('ensure user cannot see sales list without authentication', async ({ client }) => {
    // Act
    const response = await client.get(endpoint)

    // Assert
    response.assertStatus(401)
  })

  test('ensure user cannot see sales list with invalid token', async ({ client }) => {
    // Act
    const response = await client.get(endpoint).header('Authorization', `Bearer invalid_token`)

    // Assert
    response.assertStatus(401)
  })
})
