import { mockInvalidData, mockRegisterUser, mockUser } from '#tests/mocks/mock_auth'
import { test } from '@japa/runner'

test.group('Auth register tests', () => {
  const endpoint = '/auth/signup'

  test('register a new user', async ({ client, assert }) => {
    const response = await client.post(endpoint).json(mockRegisterUser)

    response.assertStatus(201)
    assert.equal(response.body().message, 'User registered successfully.')
    assert.exists(response.body().user)
  })

  test('register a new user with invalid data', async ({ client, assert }) => {
    const response = await client.post(endpoint).json(mockInvalidData)

    response.assertStatus(422)
    assert.exists(response.body().errors, 'Errors object does not exist')
  })

  test('register a new user with an existing email', async ({ client, assert }) => {
    const response = await client.post(endpoint).json(mockUser)

    response.assertStatus(422)
    assert.exists(response.body().errors, 'Errors object does not exist')
  })
})
