import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { updateValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async show({ params, response, i18n }: HttpContext) {
    const user = await User.query()
      .select('id', 'fullName', 'email')
      .where('id', params.id)
      .firstOrFail()

    return response.ok({
      message: i18n.t('user_messages.detail.success'),
      user,
    })
  }

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
        user,
      },
    })
  }

  async destroy({ params, response, i18n }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await db.transaction(async (trx) => {
      await user.useTransaction(trx).delete()
    })

    return response.ok({ success: { message: i18n.t('user_messages.delete.success') } })
  }
}
