import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Auth logout tests', () => {
  test('logout with authentication', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete('/auth/logout')
      .header('Authorization', `Bearer ${token}`)
      .send()

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().message, 'Logged out successfully.')
  })

  test('logout without authentication', async ({ client }) => {
    // Act
    const response = await client.delete('/auth/logout').send()

    // Assert
    response.assertStatus(401)
  })
})
