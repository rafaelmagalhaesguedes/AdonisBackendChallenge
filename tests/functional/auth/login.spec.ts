import { test } from '@japa/runner'

test.group('Auth login tests', () => {
  test('login with valid credentials', async ({ client, assert }) => {
    const response = await client.post('/auth/login').json({
      email: 'user@user.com',
      password: 'secret_user',
    })

    response.assertStatus(200)
    assert.equal(response.body().message, 'Logged in successfully.')
    assert.exists(response.body().token)
    assert.exists(response.body().user)
  })

  test('login with invalid credentials', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'user@user.com',
      password: 'secret_user_wrong',
    })

    response.assertStatus(400)
  })

  test('login with invalid data', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'wrong-email',
      password: '123',
    })

    response.assertStatus(422)
  })
})
