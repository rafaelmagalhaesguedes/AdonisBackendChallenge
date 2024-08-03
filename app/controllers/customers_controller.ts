import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/customer'
import { serializeCustomer, serializeCustomerCreated } from '#database/serialize/customer_serialize'

export default class CustomersController {
  /**
   * List all customers with pagination.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and paginated customer list.
   */
  async index({ request, response, i18n }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const customers = await Customer.query()
      .select('id', 'name', 'email', 'cpf')
      .orderBy('id', 'asc')
      .paginate(page, limit)
      .then((pagination) => pagination.toJSON())

    return response.ok({
      message: i18n.t('customer_messages.list.success'),
      paginate: customers.meta,
      data: customers.data,
    })
  }

  /**
   * Create a new customer.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and created customer details.
   */
  async store({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)

    const customer = await Customer.create(payload)

    return response.created({
      message: i18n.t('customer_messages.create.success'),
      data: serializeCustomerCreated(customer),
    })
  }

  /**
   * Show details of a customer by their ID, including addresses, phones, and sales.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and customer details.
   */
  async show({ params, request, response, i18n }: HttpContext) {
    const month = request.input('month')
    const year = request.input('year')

    const customer = await Customer.query()
      .where('id', params.id)
      .preload('addresses')
      .preload('phones')
      .preload('sales', (salesQuery) => {
        salesQuery.orderBy('createdAt', 'desc')
        if (month && year) {
          salesQuery.whereRaw('MONTH(createdAt) = ? AND YEAR(createdAt) = ?', [month, year])
        }
        salesQuery.preload('product')
      })
      .firstOrFail()

    return response.ok({
      message: i18n.t('customer_messages.detail.success'),
      data: serializeCustomer(customer),
    })
  }

  /**
   * Update customer details.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and updated customer details.
   */
  async update({ params, request, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const payload = await request.validateUsing(updateValidator)

    await db.transaction(async (trx) => {
      customer.useTransaction(trx).merge(payload)
      await customer.save()
    })

    return response.ok({
      message: i18n.t('customer_messages.update.success'),
      data: customer.serialize(),
    })
  }

  /**
   * Delete a customer and all related data (addresses, phones, sales).
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message for delete operation.
   */
  async destroy({ params, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)

    await db.transaction(async (trx) => {
      try {
        // Delete all related addresses
        await customer.related('addresses').query().delete()

        // Delete all related phones
        await customer.related('phones').query().delete()

        // Delete all related sales
        await customer.related('sales').query().delete()

        // Delete the customer
        await customer.delete()

        await trx.commit() // Manual Commit the transaction

        return response.ok({ success: { message: i18n.t('customer_messages.delete.success') } })
      } catch (error) {
        await trx.rollback() // Manual Rollback the transaction
        return response.internalServerError({
          error: { message: i18n.t('customer_messages.error.internal_error') },
        })
      }
    })
  }
}
