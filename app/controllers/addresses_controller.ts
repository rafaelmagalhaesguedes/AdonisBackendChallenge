import Address from '#models/address'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import { createValidator } from '#validators/address'
import type { HttpContext } from '@adonisjs/core/http'

export default class AddressesController {
  async store({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const customer = await Customer.findOrFail(params.customerId)

    const address = await customer.related('addresses').create(payload)

    return response.created({
      message: i18n.t('address_messages.create.success'),
      address,
    })
  }

  async update({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const customer = await Customer.findOrFail(params.id)
    const address = await Address.query().where('id', params.customerId).firstOrFail()

    // Check if the address belongs to the customer
    if (address.customerId !== customer.id) {
      return response.badRequest({
        error: { message: i18n.t('address_messages.error.not_belongs_to_customer') },
      })
    }

    await db.transaction(async (trx) => {
      address.merge(payload)
      await address.useTransaction(trx).save()
    })

    address.refresh()

    return response.ok({
      message: i18n.t('address_messages.update.success'),
      address,
    })
  }

  async destroy({ params, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const address = await Address.query().where('id', params.customerId).firstOrFail()

    // Check if the address belongs to the customer
    if (address.customerId !== customer.id) {
      return response.badRequest({
        error: { message: i18n.t('address_messages.error.not_belongs_to_customer') },
      })
    }

    await db.transaction(async (trx) => {
      await address.useTransaction(trx).delete()
    })

    return response.ok({ success: { message: i18n.t('address_messages.delete.success') } })
  }
}
