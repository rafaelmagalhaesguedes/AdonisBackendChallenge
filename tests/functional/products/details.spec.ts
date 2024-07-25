import { ProductFactory } from '#database/factories/product_factory'
import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Product details tests', (group) => {
  const endpoint = '/products/details'
  const successMessage = 'Product details retrieved successfully.'
  let productId: number

  group.setup(async () => {
    const product = await ProductFactory.create()
    productId = product.id
  })

  test('get a product details with authentication', async ({ client, assert }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .get(`${endpoint}/${productId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, successMessage)
    assert.exists(response.body().product)
  })

  test('get a product details without authentication', async ({ client }) => {
    const response = await client.get(`${endpoint}/${productId}`)

    response.assertStatus(401)
  })

  test('get a product details with invalid id', async ({ client }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .get(`${endpoint}/99999999`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
  })

  test('get a product details with invalid id without authentication', async ({ client }) => {
    const response = await client.get(`${endpoint}/99999999`)

    response.assertStatus(401)
  })
})
