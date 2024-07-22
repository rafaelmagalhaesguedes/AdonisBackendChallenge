import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'

test.group('register tests', () => {
  test('register a new user', async ({ client, assert }) => {
    const hashedPassword = await hash.make('123456')
    const response = await client.post('/auth/signup').json({
      fullName: 'Rafa Guedes',
      email: `unique${Date.now()}@email.com`, // Ensuring email uniqueness
      password: hashedPassword,
    })

    response.assertStatus(201)
    assert.exists(response.body().id)
    assert.equal(response.body().fullName, 'Rafa Guedes')
    assert.equal(response.body().email, response.body().email)
  })
})
