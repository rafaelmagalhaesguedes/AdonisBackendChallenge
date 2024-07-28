import { test } from '@japa/runner'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { ProductFactory } from '#database/factories/product_factory'

test.group('Product delete tests', (group) => {
  const endpoint = '/products/delete'
  const successMessage = 'Product removed successfully.'
  let productId: number

  group.setup(async () => {
    const product = await ProductFactory.create()
    productId = product.id
  })

  test('delete a product successfully', async ({ client, assert }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${endpoint}/${productId}`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().message, successMessage)
  })

  test('delete a product without authentication', async ({ client }) => {
    // Act
    const response = await client.delete(`${endpoint}/${productId}`)

    // Assert
    response.assertStatus(401)
  })

  test('delete a product that does not exist', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${endpoint}/99999999`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(404)
  })

  test('delete a product with invalid id', async ({ client }) => {
    // Arrange
    const token = await loginAndGetToken(client)

    // Act
    const response = await client
      .delete(`${endpoint}/invalid_id`)
      .header('Authorization', `Bearer ${token}`)

    // Assert
    response.assertStatus(404)
  })
})
