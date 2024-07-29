import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { CustomerFactory } from '#database/factories/customer_factory'

test.group('Phones create tests', (global) => {
  const endpoint = '/phones/create'
  let customerId: number

  global.setup(async () => {
    const customer = await CustomerFactory.create()
    customerId = customer.id
  })

  test('should create a new phone valid data', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(`${endpoint}/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json({
        number: '1234567890',
        type: 'mobile',
      })

    // Assert
    response.assertStatus(201)
    assert.exists(response.body().message, 'Phone registered successfully.')
    assert.exists(response.body().phone)
  })

  test('should not create a new phone with invalid data', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(`${endpoint}/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json({
        number: '1234567890',
      })

    // Assert
    response.assertStatus(422)
  })

  test('should not create a new phone with invalid customer', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(`${endpoint}/9999999999999`)
      .header('Authorization', `Bearer ${token}`)
      .json({
        number: '1234567890',
        type: 'mobile',
      })

    // Assert
    response.assertStatus(404)
  })

  test('should not create a new phone without a token', async ({ client }) => {
    // Act
    const response = await client.post(`${endpoint}/${customerId}`).json({
      number: '1234567890',
      type: 'mobile',
    })

    // Assert
    response.assertStatus(401)
  })
})
