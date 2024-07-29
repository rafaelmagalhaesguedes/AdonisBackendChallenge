import { DateTime } from 'luxon'
import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/product'
import { serializeProduct, serializeProductUpdated } from '#database/serialize/product_serialize'

export default class ProductsController {
  /**
   * List all products with pagination.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with List of products and pagination meta data.
   */
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

  /**
   * Create a new product.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with Success message and created product details.
   */
  async store({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)

    const product = await Product.create(payload)

    return response.created({
      message: i18n.t('product_messages.create.success'),
      product: serializeProduct(product),
    })
  }

  /**
   * Show details of a product by its ID.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns Product JSON with success message and product details.
   */
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

  /**
   * Update a product's details.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and updated product details.
   */
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

  /**
   * Soft delete a product by setting its `deletedAt` timestamp.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message for soft delete operation.
   */
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
