import Customer from '#models/customer'
import { createValidator, updateValidator } from '#validators/customer'
import type { HttpContext } from '@adonisjs/core/http'
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
      customers: customers.data,
    })
  }

  async store({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const { id, name, email, cpf } = await Customer.create(payload)

    return response.created({
      message: i18n.t('customer_messages.create.success'),
      customer: { id, name, email, cpf },
    })
  }

  async show({ params, request, response, i18n }: HttpContext) {
    const month = request.input('month')
    const year = request.input('year')

    const customer = await Customer.query()
      .where('id', params.id)
      .select('id', 'name', 'email', 'cpf')
      .preload('addresses')
      .preload('phones')
      .preload('sales', (salesQuery) => {
        salesQuery.orderBy('createdAt', 'desc')
        if (month && year) {
          salesQuery.whereRaw('MONTH(createdAt) = ? AND YEAR(createdAt) = ?', [month, year])
        }
        salesQuery.preload('product')
      })
      .firstOrFail() // Throws an exception if no record is found

    const serializedCustomer = serializeCustomer(customer)

    return response.ok({
      message: i18n.t('customer_messages.detail.success'),
      customer: serializedCustomer,
    })
  }

  async update({ params, request, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const payload = await request.validateUsing(updateValidator)

    customer.merge(payload)
    await customer.save()
    customer.refresh()

    const { id, name, email, cpf } = customer

    return response.ok({
      message: i18n.t('customer_messages.update.success'),
      customer: { id, name, email, cpf },
    })
  }

  async destroy({ params, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)

    // Delete all related sales
    await customer.related('sales').query().delete()

    // Delete the customer
    await customer.delete()

    return response.ok({ message: i18n.t('customer_messages.delete.success') })
  }
}
