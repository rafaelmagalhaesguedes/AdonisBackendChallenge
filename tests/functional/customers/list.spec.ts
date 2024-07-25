import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Customers list tests', () => {
  const enpoint = '/customers/list'

  test('should return a list of customers', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client.get(enpoint).header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'Customers retrieved successfully.')
    assert.isArray(response.body().customers)
  })

  test('should return an error when the user is not authenticated', async ({ client }) => {
    // Act
    const response = await client.get(enpoint)

    // Assert
    response.assertStatus(401)
  })
})
