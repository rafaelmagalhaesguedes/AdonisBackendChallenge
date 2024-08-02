import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { CustomerFactory } from '#database/factories/customer_factory'
import { mockAddress, mockInvadidAddress } from '#tests/mocks/mock_addresses'

test.group('Address create tests', (global) => {
  const endpoint = '/address/create'
  let customerId: number

  global.setup(async () => {
    const customer = await CustomerFactory.create()
    customerId = customer.id
  })

  test('should create an address', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(`${endpoint}/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockAddress)

    // Assert
    response.assertStatus(201)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'Address registered successfully.')
    assert.exists(response.body().data)
  })

  test('should not create an address with invalid data', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(`${endpoint}/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvadidAddress)

    // Assert
    response.assertStatus(422)
  })

  test('should not create an address with invalid customer id', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .post(`${endpoint}/0`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockAddress)

    // Assert
    response.assertStatus(404)
  })
})
