import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    return response.created({
      message: i18n.t('auth.register.success'),
      user,
    })
  }

  async login({ request, response, i18n }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      message: i18n.t('auth.login.success'),
      token,
      ...user.serialize(),
    })
  }

  async logout({ auth, response, i18n }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({
        message: i18n.t('auth.logout.token_not_found'),
      })
    }

    await User.accessTokens.delete(user, token)

    return response.ok({
      message: i18n.t('auth.logout.success'),
    })
  }
}
