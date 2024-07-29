import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { PhoneFactory } from '#database/factories/phone_factory'
import { CustomerFactory } from '#database/factories/customer_factory'
import { mockInvalidPhone, mockPhone } from '#tests/mocks/mock_phones'

test.group('Phones update tests', (group) => {
  const enpoint = '/phones/update'
  const successMessage = 'Phone updated successfully.'
  let customerId: number
  let phoneId: number

  group.setup(async () => {
    const customer = await CustomerFactory.create()
    customerId = customer.id

    const phone = await PhoneFactory.merge({ customerId }).create()
    phoneId = phone.id
  })

  test('should update a customer with valid data', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/${phoneId}/customer/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockPhone)

    // Assert
    response.assertStatus(200)
    assert.exists(response.body().message, successMessage)
    assert.exists(response.body().phone)
  })

  test('should not update a phone with invalid data', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/${phoneId}/customer/${customerId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidPhone)

    // Assert
    response.assertStatus(422)
  })

  test('should not update a phone with invalid customer', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .patch(`${enpoint}/${phoneId}/customer/9999999999999`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockPhone)

    // Assert
    response.assertStatus(404)
  })

  test('should not update a phone without a token', async ({ client }) => {
    // Act
    const response = await client
      .patch(`${enpoint}/${phoneId}/customer/${customerId}`)
      .json(mockPhone)

    // Assert
    response.assertStatus(401)
  })
})
