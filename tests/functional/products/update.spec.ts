import { loginAndGetToken } from '#tests/factories/auth_factory'
import { mockInvalidProductData, mockProductData } from '#tests/mocks/mock_products'
import { ProductFactory } from '#database/factories/product_factory'
import { test } from '@japa/runner'

test.group('Product update tests', (group) => {
  let productId: number

  group.setup(async () => {
    const product = await ProductFactory.create()
    productId = product.id
  })

  test('update a product successfully', async ({ client, assert }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .patch(`/products/update/${productId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockProductData)

    response.assertStatus(200)
    assert.equal(response.body().message, 'Product updated successfully.')
    assert.exists(response.body().product)
  })

  test('update a product with invalid data', async ({ client }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .patch(`/products/update/${productId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(mockInvalidProductData)

    response.assertStatus(422)
  })

  test('update a product with invalid id', async ({ client }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .patch('/products/update/999')
      .header('Authorization', `Bearer ${token}`)
      .json(mockProductData)

    response.assertStatus(404)
  })

  test('update a product without authentication', async ({ client }) => {
    const response = await client.patch(`/products/update/${productId}`).json(mockProductData)

    response.assertStatus(401)
  })
})
