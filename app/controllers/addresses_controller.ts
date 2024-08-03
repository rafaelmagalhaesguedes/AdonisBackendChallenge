import Address from '#models/address'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import { createValidator } from '#validators/address'
import type { HttpContext } from '@adonisjs/core/http'

export default class AddressesController {
  /**
   * Create a new address for a customer.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {number} ctx.params.customerId - The ID of the customer.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and created address details.
   */
  async store({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const customer = await Customer.findOrFail(params.customerId)

    const address = await customer.related('addresses').create(payload)

    return response.created({
      message: i18n.t('address_messages.create.success'),
      data: address,
    })
  }

  /**
   * Update an address for a customer.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {number} ctx.params.id - The ID of the customer.
   * @param {number} ctx.params.customerId - The ID of the address.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and updated address details.
   */
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
      address.useTransaction(trx).merge(payload)
      await address.save()
    })

    address.refresh()

    return response.ok({
      message: i18n.t('address_messages.update.success'),
      data: address,
    })
  }

  /**
   * Delete an address of a customer.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {number} ctx.params.id - The ID of the customer.
   * @param {number} ctx.params.customerId - The ID of the address.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message for delete operation.
   */
  async destroy({ params, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const address = await Address.query().where('id', params.customerId).firstOrFail()

    // Check if the address belongs to the customer
    if (address.customerId !== customer.id) {
      return response.badRequest({
        error: { message: i18n.t('address_messages.error.not_belongs_to_customer') },
      })
    }

    await address.delete()

    return response.ok({ success: { message: i18n.t('address_messages.delete.success') } })
  }
}
