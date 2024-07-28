import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'

test.group('Sales details tests', () => {
  const endpoint = '/sales/details'

  test('ensure user can see sales details', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client.get(`${endpoint}/${1}`).header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    const { message, sale } = response.body()
    assert.exists(message)
    assert.equal(message, 'Sale details retrieved successfully.')
    assert.exists(sale)
  })

  test('ensure user cannot see sales details without authentication', async ({ client }) => {
    // Act
    const response = await client.get(`${endpoint}/${1}`)

    // Assert
    response.assertStatus(401)
  })

  test('ensure user cannot see sales details with invalid id', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .get(`${endpoint}/99999999`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(404)
  })
})
