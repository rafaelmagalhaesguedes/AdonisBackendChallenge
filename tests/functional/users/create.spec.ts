import User from '#models/user'
import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'

test.group('User API Tests', () => {
  test('successfully creates a user', async ({ client, assert }) => {
    const userDetails = {
      fullName: 'Rafael Guedes',
      email: `rafa${Date.now()}@example.com`,
      password: 'password123',
    }

    const response = await client.post('/users/signup').json(userDetails)

    assert.equal(response.status(), 201)
    assert.exists(response.body)
  })

  test('fails to create a user with an existing email', async ({ client, assert }) => {
    const userDetails = {
      fullName: 'Rafael Guedes',
      email: `rafa${Date.now()}@example.com`,
      password: 'password123',
    }

    await client.post('/users/signup').json(userDetails)

    const response = await client.post('/users/signup').json(userDetails)

    assert.equal(response.status(), 409)
    assert.equal(response.body().message, 'E-mail já está em uso (email)')
  })
})

test.group('User Creation Tests', () => {
  test('successfully creates a new user with valid details', async ({ assert }) => {
    const user = new User()

    user.fullName = 'Rafa Guedes'
    user.email = `unique${Date.now()}@email.com` // Ensuring email uniqueness

    const hashedPassword = await hash.make('123456')
    user.password = hashedPassword

    await user.save()

    assert.exists(user.id)
    assert.equal(user.fullName, 'Rafa Guedes')
  })

  test('correctly hashes the password upon user creation', async ({ assert }) => {
    const user = new User()
    user.password = 'secret'
    user.email = `uniqueTest${Date.now()}@example.com` // Ensuring email uniqueness

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
})
