import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { updateValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Show details of a user by their ID.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns User JSON with success message and user details.
   * *
   */
  async show({ params, response, i18n }: HttpContext) {
    const user = await User.query()
      .select('id', 'fullName', 'email')
      .where('id', params.id)
      .firstOrFail()

    return response.ok({
      message: i18n.t('user_messages.detail.success'),
      data: user,
    })
  }

  /**
   * Update a user's details.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns User JSON with success message and updated user details.
   */
  async update({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(updateValidator)
    const user = await User.findOrFail(params.id)

    await db.transaction(async (trx) => {
      user.merge(payload)
      await user.useTransaction(trx).save()
    })

    return response.ok({
      success: {
        message: i18n.t('user_messages.update.success'),
        data: user,
      },
    })
  }

  /**
   * Delete a user by their ID.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON with success message.
   */
  async destroy({ params, response, i18n }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.ok({ success: { message: i18n.t('user_messages.delete.success') } })
  }
}
