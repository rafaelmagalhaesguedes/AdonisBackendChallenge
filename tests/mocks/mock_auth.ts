export const mockRegisterUser = {
  fullName: 'Rafa Guedes',
  email: `unique${Date.now()}@email.com`, // Ensuring email uniqueness
  password: '123456',
}

export const mockInvalidData = {
  fullName: 'R',
  email: 'invalid-email',
  password: '123',
}

export const mockUser = {
  fullName: 'User',
  email: 'user@user.com',
  password: 'secret_user',
}
