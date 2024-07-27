import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Product list tests', () => {
  const endpoint = '/products/list'
  const successMessage = 'Products retrieved successfully.'

  test('get a list of products with authentication', async ({ client, assert }) => {
    const token = await loginAndGetToken(client)

    const response = await client.get(endpoint).header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, successMessage)
    assert.exists(response.body().products)
  })

  test('get a list of products without authentication', async ({ client }) => {
    const response = await client.get(endpoint)

    response.assertStatus(401)
  })

  test('get a list of products with pagination', async ({ client, assert }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .get(`${endpoint}?page=1&limit=1`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, successMessage)
    assert.exists(response.body().products)
    assert.lengthOf(response.body().products, 1)
  })

  test('get a list of products with invalid pagination', async ({ client, assert }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .get(`${endpoint}?page=99999999&limit=99999999`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.exists(response.body().message)
    assert.equal(response.body().message, successMessage)
    assert.exists(response.body().products)
    assert.isEmpty(response.body().products)
  })

  test('get a list of products with invalid token', async ({ client }) => {
    const response = await client.get(endpoint).header('Authorization', `Bearer invalid_token`)

    response.assertStatus(401)
  })
})
