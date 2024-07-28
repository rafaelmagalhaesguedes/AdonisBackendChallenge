import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import { serializeUser, serializeUserLogin } from '#database/serialize/user_serialize'

export default class AuthController {
  async register({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)

    return response.created({
      message: i18n.t('auth_messages.register.success'),
      user: serializeUser(user),
    })
  }

  async login({ request, response, i18n }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    const accessToken = await User.accessTokens.create(user)
    const { token } = accessToken.toJSON()

    return response.ok({
      message: i18n.t('auth_messages.login.success'),
      token: token,
      user: serializeUserLogin(user),
    })
  }

  async logout({ auth, response, i18n }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ message: i18n.t('auth_messages.logout.success') })
  }

  async me({ auth }: HttpContext) {
    await auth.check()
    return { user: auth.user }
  }
}
