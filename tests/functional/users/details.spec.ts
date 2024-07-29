import { UserFactory } from '#database/factories/user_factory'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Users details tests', (group) => {
  const enpoint = '/users/details'
  const successMessage = 'User details retrieved successfully.'
  let userId: number

  group.setup(async () => {
    const user = await UserFactory.create()
    userId = user.id
  })

  test('should get details of a user', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .get(`${enpoint}/${userId}`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().message, successMessage)
  })

  test('should return 401 when user is not authenticated', async ({ client }) => {
    // Act
    const response = await client.get(`${enpoint}/${userId}`)

    // Assert
    response.assertStatus(401)
  })

  test('should return 404 when user is not found', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .get(`${enpoint}/99999999999999`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(404)
  })
})
