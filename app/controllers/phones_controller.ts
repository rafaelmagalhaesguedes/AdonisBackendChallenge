import Phone from '#models/phone'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import { createValidator } from '#validators/phone'
import type { HttpContext } from '@adonisjs/core/http'

export default class PhonesController {
  async store({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const customer = await Customer.findOrFail(params.customerId)

    const phone = await customer.related('phones').create(payload)

    return response.created({
      message: i18n.t('phone_messages.create.success'),
      phone,
    })
  }

  async update({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const customer = await Customer.findOrFail(params.customerId)
    const phone = await Phone.query().where('id', params.id).first()

    // Check if the phone belongs to the customer
    if (!phone || phone.customerId !== customer.id) {
      return response.badRequest({
        error: { message: i18n.t('phone_messages.error.not_belongs_to_customer') },
      })
    }

    await db.transaction(async (trx) => {
      phone.merge(payload)
      await phone.useTransaction(trx).save()
    })

    await phone.refresh()

    return response.ok({
      message: i18n.t('phone_messages.update.success'),
      phone,
    })
  }

  async destroy({ params, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.customerId)
    const phone = await Phone.query().where('id', params.id).firstOrFail()

    // Check if the phone belongs to the customer
    if (!phone || phone.customerId !== customer.id) {
      return response.badRequest({
        error: { message: i18n.t('phone_messages.error.not_belongs_to_customer') },
      })
    }

    await db.transaction(async (trx) => {
      await phone.useTransaction(trx).delete()
    })

    return response.ok({ success: { message: i18n.t('phone_messages.delete.success') } })
  }
}
