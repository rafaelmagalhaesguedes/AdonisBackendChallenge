import { test } from '@japa/runner'
import { PhoneFactory } from '#database/factories/phone_factory'
import { CustomerFactory } from '#database/factories/customer_factory'
import { loginAndGetToken } from '#tests/factories/auth_factory'

test.group('Phones delete tests', (group) => {
  const enpoint = '/phones/delete'
  const successMessage = 'Phone removed successfully.'
  let customerId: number
  let phoneId: number

  group.setup(async () => {
    const customer = await CustomerFactory.create()
    customerId = customer.id

    const phone = await PhoneFactory.merge({ customerId }).create()
    phoneId = phone.id
  })

  test('should delete a phone', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${enpoint}/${phoneId}/customer/${customerId}`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().success, successMessage)
  })

  test('should not delete a phone that does not belong to the customer', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)
    const customer = await CustomerFactory.create()

    // Act
    const response = await client
      .delete(`${enpoint}/${phoneId}/customer/${customer.id}`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(404)
  })

  test('should not delete a phone without a token', async ({ client }) => {
    // Act
    const response = await client.delete(`${enpoint}/${phoneId}/customer/${customerId}`)

    // Assert
    response.assertStatus(401)
  })
})
