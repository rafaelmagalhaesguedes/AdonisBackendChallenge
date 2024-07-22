import { test } from '@japa/runner'

test.group('register tests', () => {
  test('register a new user', async ({ client, assert }) => {
    const response = await client.post('/auth/signup').json({
      fullName: 'Rafa Guedes',
      email: `unique${Date.now()}@email.com`, // Ensuring email uniqueness
      password: '123456',
    })

    response.assertStatus(201)
    assert.equal(
      response.body().message,
      'User registered successfully.',
      'Success message does not match'
    )
  })

  test('register a new user with invalid data', async ({ client, assert }) => {
    const response = await client.post('/auth/signup').json({
      fullName: 'R',
      email: 'invalid-email',
      password: '123',
    })

    response.assertStatus(422)
    assert.exists(response.body().errors, 'Errors object does not exist')
  })

  test('register a new user with an existing email', async ({ client, assert }) => {
    const response = await client.post('/auth/signup').json({
      fullName: 'User',
      email: 'user@user.com',
      password: 'secret_user',
    })

    response.assertStatus(422)
    assert.exists(response.body().errors, 'Errors object does not exist')
  })
})
