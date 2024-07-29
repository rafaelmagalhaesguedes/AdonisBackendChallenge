import { UserFactory } from '#database/factories/user_factory'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Users update tests', (group) => {
  const enpoint = '/users/update'
  let userId: number
  let fullName: string | null
  let email: string

  group.setup(async () => {
    const user = await UserFactory.create()
    userId = user.id
    fullName = user.fullName
    email = user.email
  })

  test('should update a user', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/${userId}`)
      .header('Authorization', `Bearer ${token}`)
      .json({ fullName, email })

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().success.message, 'User updated successfully.')
  })

  test('should return 401 when user is not authenticated', async ({ client }) => {
    // Act
    const response = await client.patch(`${enpoint}/${userId}`)

    // Assert
    response.assertStatus(401)
  })

  test('should return 404 when user is not found', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/99999999999999`)
      .header('Authorization', `Bearer ${token}`)
      .json({ fullName, email })

    // Assert
    response.assertStatus(404)
  })
})
