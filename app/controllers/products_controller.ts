import { DateTime } from 'luxon'
import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/product'
import { serializeProduct, serializeProductUpdated } from '#database/serialize/product_serialize'

export default class ProductsController {
  async index({ response, request, i18n }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const products = await Product.query()
      .select('id', 'name', 'description', 'price', 'category', 'stock')
      .whereNull('deletedAt')
      .orderBy('name', 'asc')
      .paginate(page, limit)
      .then((pagination) => pagination.toJSON())

    return response.ok({
      message: i18n.t('product_messages.list.success'),
      paginate: products.meta,
      products: products.data,
    })
  }

  async store({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)

    const product = await Product.create(payload)

    return response.created({
      message: i18n.t('product_messages.create.success'),
      product: serializeProduct(product),
    })
  }

  async show({ params, response, i18n }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deletedAt')
      .firstOrFail()

    return response.ok({
      message: i18n.t('product_messages.detail.success'),
      product: serializeProduct(product),
    })
  }

  async update({ params, request, response, i18n }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(updateValidator)

    if (product.deletedAt !== null) {
      return response.notFound({ error: { message: i18n.t('product_messages.error.not_found') } })
    }

    await db.transaction(async (trx) => {
      product.merge(payload)
      await product.useTransaction(trx).save()
    })

    return response.ok({
      message: i18n.t('product_messages.update.success'),
      product: serializeProductUpdated(product),
    })
  }

  async destroy({ params, response, i18n }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    if (product.deletedAt !== null) {
      return response.notFound({ error: { message: i18n.t('product_messages.error.not_found') } })
    }

    await db.transaction(async (trx) => {
      product.deletedAt = DateTime.fromJSDate(new Date())
      await product.useTransaction(trx).save()
    })

    return response.ok({ success: { message: i18n.t('product_messages.delete.success') } })
  }
}
