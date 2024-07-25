import { CustomerFactory } from '#database/factories/customer_factory'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Customers delete tests', (group) => {
  const enpoint = '/customers/delete'
  const successMessage = 'Customer removed successfully.'
  let customerId: number

  group.setup(async () => {
    const customer = await CustomerFactory.create()
    customerId = customer.id
  })

  test('should delete a customer', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${enpoint}/${customerId}`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, successMessage)
  })

  test('should return an error when the user is not authenticated', async ({ client }) => {
    // Act
    const response = await client.delete(`${enpoint}/${customerId}`)

    // Assert
    response.assertStatus(401)
  })

  test('should return an error when the customer id is invalid', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${enpoint}/999999999`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(404)
  })
})
