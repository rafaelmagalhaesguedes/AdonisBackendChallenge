import { loginAndGetToken } from '#tests/factories/auth_factory'
import { test } from '@japa/runner'

test.group('Auth logout tests', () => {
  test('logout with authentication', async ({ client, assert }) => {
    const token = await loginAndGetToken(client)

    const response = await client
      .post('/auth/logout')
      .header('Authorization', `Bearer ${token}`)
      .send()

    response.assertStatus(200)
    assert.equal(response.body().message, 'Logged out successfully.')
  })

  test('logout without authentication', async ({ client }) => {
    const response = await client.post('/auth/logout').send()

    response.assertStatus(401)
  })
})
