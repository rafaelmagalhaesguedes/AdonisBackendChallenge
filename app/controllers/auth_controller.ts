import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import { serializeUser, serializeUserLogin } from '#database/serialize/user_serialize'

export default class AuthController {
  /**
   * Register a new user.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and registered user details.
   */
  async register({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)

    return response.created({
      message: i18n.t('auth_messages.register.success'),
      user: serializeUser(user),
    })
  }

  /**
   * Log in a user and return a token.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and user token and details.
   */
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

  /**
   * Log out the currently authenticated user.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.auth - The authentication object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message for logout operation.
   */
  async logout({ auth, response, i18n }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ message: i18n.t('auth_messages.logout.success') })
  }

  /**
   * Get details of the currently authenticated user.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.auth - The authentication object.
   * @returns JSON object with details of the authenticated user.
   */
  async me({ auth }: HttpContext) {
    await auth.check()
    return { user: auth.user }
  }
}
