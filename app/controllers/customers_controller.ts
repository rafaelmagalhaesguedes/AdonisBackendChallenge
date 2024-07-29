import Address from '#models/address'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { createAddressValidator, createValidator, updateValidator } from '#validators/customer'
import { serializeCustomer, serializeCustomerCreated } from '#database/serialize/customer_serialize'

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

    const customer = await db.transaction(async (trx) => {
      return await Customer.create(payload, { client: trx })
    })

    return response.created({
      message: i18n.t('customer_messages.create.success'),
      customer: serializeCustomerCreated(customer),
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
      customer.merge(payload)
      await customer.useTransaction(trx).save()
    })

    return response.ok({
      message: i18n.t('customer_messages.update.success'),
      customer: customer.serialize(),
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

  async storeAddress({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createAddressValidator)
    const customer = await Customer.findOrFail(params.id)

    const address = await customer.related('addresses').create(payload)

    return response.created({
      message: i18n.t('address_messages.create.success'),
      address,
    })
  }

  async updateAddress({ params, request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createAddressValidator)
    const customer = await Customer.findOrFail(params.id)
    const address = await Address.query().where('id', params.addressId).firstOrFail()

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

  async destroyAddress({ params, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const address = await Address.query().where('id', params.addressId).firstOrFail()

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
