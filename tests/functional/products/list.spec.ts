import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Product list tests', () => {
  test('get a list of products with authentication', async ({ client, assert }) => {
    const token = await loginAndGetToken(client)

    const response = await client.get('/products/list').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'Products retrieved successfully.')
    assert.exists(response.body().products)
  })

  test('get a list of products without authentication', async ({ client }) => {
    const response = await client.get('/products/list')

    response.assertStatus(401)
  })
})
