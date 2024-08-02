import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Customers list tests', () => {
  const enpoint = '/customers/list'

  test('should return a list of customers', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client.get(enpoint).header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'Customers retrieved successfully.')
    assert.isArray(response.body().data)
  })

  test('should return an error when the user is not authenticated', async ({ client }) => {
    // Act
    const response = await client.get(enpoint)

    // Assert
    response.assertStatus(401)
  })

  test('should return a list of customers with pagination', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .get(`${enpoint}?page=1&limit=1`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'Customers retrieved successfully.')
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 1)
  })

  test('should return a list of customers with invalid pagination', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .get(`${enpoint}?page=99999999&limit=99999999`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'Customers retrieved successfully.')
    assert.isArray(response.body().data)
    assert.isEmpty(response.body().data)
  })

  test('should return an error when the user is not authenticated with invalid pagination', async ({
    client,
  }) => {
    // Act
    const response = await client.get(`${enpoint}?page=99999999&limit=99999999`)

    // Assert
    response.assertStatus(401)
  })
})
