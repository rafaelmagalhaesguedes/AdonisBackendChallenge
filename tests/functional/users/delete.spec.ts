import { UserFactory } from '#database/factories/user_factory'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Users delete tests', (group) => {
  const enpoint = '/users/delete'
  let userId: number

  group.setup(async () => {
    const user = await UserFactory.create()
    userId = user.id
  })

  test('should delete a user', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${enpoint}/${userId}`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().success.message, 'User removed successfully.')
  })

  test('should return 401 when user is not authenticated', async ({ client }) => {
    // Act
    const response = await client.delete(`${enpoint}/${userId}`)

    // Assert
    response.assertStatus(401)
  })

  test('should return 404 when user is not found', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${enpoint}/99999999999999`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(404)
  })
})
