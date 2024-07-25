import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { CustomerFactory } from '#database/factories/customer_factory'
import {
  mockCustomerData,
  mockCustomerUpdateData,
  mockInvalidCustomerData,
} from '#tests/mocks/mock_customers'

test.group('Customers update tests', (group) => {
  const enpoint = '/customers/update'
  const successMessage = 'Customer updated successfully.'
  let customerId: number

  group.setup(async () => {
    const customer = await CustomerFactory.create()
    customerId = customer.id
  })

  test('should update a customer', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockCustomerUpdateData)

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().message, successMessage)
    assert.exists(response.body().customer)
  })

  test('should return an error when the user is not authenticated', async ({ client }) => {
    // Act
    const response = await client.patch(`${enpoint}/${customerId}`).json(mockCustomerData)

    // Assert
    response.assertStatus(401)
  })

  test('should return an error when the customer id is invalid', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/999999999`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockCustomerData)

    // Assert
    response.assertStatus(404)
  })

  test('should return an error when the data is invalid', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidCustomerData)

    // Assert
    response.assertStatus(422)
  })
})
