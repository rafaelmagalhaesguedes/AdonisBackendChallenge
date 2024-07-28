/*
    This file contains the factory functions for the authentication module.
    The factory functions are used to create the data for the tests.
 */
export async function loginAndGetToken(client: any) {
  const loginResponse = await client.post('/auth/login').json({
    email: 'user@user.com',
    password: 'secret_user',
  })
  return loginResponse.body().token
}
