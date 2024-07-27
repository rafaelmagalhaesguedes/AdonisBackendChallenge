import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/customer'
import { serializeCustomer } from '#database/serialize/customer_serialize'

export default class CustomersController {
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
      customers: customers.data,
    })
  }

  async store({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)

    await db.transaction(async (trx) => {
      try {
        const { id, name, email, cpf, createdAt } = await Customer.create(payload)

        return response.created({
          message: i18n.t('customer_messages.create.success'),
          customer: { id, name, email, cpf, createdAt },
        })
      } catch (error) {
        await trx.rollback()
        return response.internalServerError({
          message: i18n.t('customer_messages.error.internal_error'),
          error: error.message,
        })
      }
    })
  }

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
      customer: serializeCustomer(customer),
    })
  }

  async update({ params, request, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const payload = await request.validateUsing(updateValidator)

    await db.transaction(async (trx) => {
      try {
        customer.merge(payload)
        await customer.save()

        return response.ok({
          message: i18n.t('customer_messages.update.success'),
          customer: customer.serialize(),
        })
      } catch (error) {
        await trx.rollback()
        return response.internalServerError({
          message: i18n.t('customer_messages.error.internal_error'),
          error: error.message,
        })
      }
    })
  }

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

        return response.ok({ message: i18n.t('customer_messages.delete.success') })
      } catch (error) {
        await trx.rollback()
        return response.internalServerError({
          message: i18n.t('customer_messages.error.internal_error'),
          error: error.message,
        })
      }
    })
  }
}
