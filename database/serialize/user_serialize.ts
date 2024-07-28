import User from '#models/user'

/**
 * Serialize user data updated to customize the output.
 * @param user The user updated entity to serialize.
 * @returns The serialized user data updated.
 */
export function serializeUser(user: User) {
  return user.serialize({
    fields: ['id', 'fullName', 'email', 'createdAt'],
  })
}

/**
 * Serialize user data to customize the output.
 * @param user The user entity to serialize.
 * @returns The serialized user data.
 */
export function serializeUserLogin(user: User) {
  return user.serialize({
    fields: ['id', 'fullName', 'email'],
  })
}
