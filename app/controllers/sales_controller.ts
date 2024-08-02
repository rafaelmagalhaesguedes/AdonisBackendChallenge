import Sale from '#models/sale'
import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'
import { createValidator } from '#validators/sale'
import logger from '@adonisjs/core/services/logger'
import type { HttpContext } from '@adonisjs/core/http'

import { serializeSale, serializeSaleCreated } from '#database/serialize/sale_serialize'

export default class SalesController {
  /**
   * List all sales with pagination.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON Object list of sales with pagination meta data.
   */
  async index({ request, response, i18n }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const cacheKey = `sales:page:${page}:limit:${limit}`

    // Check if the data is in the cache
    const cachedSales = await redis.get(cacheKey)
    if (cachedSales) {
      return response.ok(JSON.parse(cachedSales))
    }

    logger.info(`Checking cache for key: ${cacheKey}`)

    const sales = await Sale.query()
      .select('id', 'quantity', 'totalAmount', 'createdAt')
      .orderBy('id', 'asc')
      .paginate(page, limit)
      .then((pagination) => pagination.toJSON())

    logger.info(`Setting cache for key: ${cacheKey}`)

    // Cache the data
    await redis.set(cacheKey, JSON.stringify(sales), 'EX', 60 * 60) // Cache for 1 hour

    return response.ok({
      message: i18n.t('sale_messages.list.success'),
      paginate: sales.meta,
      sales: sales.data,
    })
  }

  /**
   * Create a new sale.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.request - The HTTP request object.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns JSON object with success message and created sale details.
   */
  async store({ request, response, i18n }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(createValidator)
    const { customerId, productId, quantity } = payload

    logger.info(`Creating sale for customer ${customerId} and product ${productId}`)

    // Validate if the customer and product exist
    await db.from('customers').where('id', customerId).firstOrFail()
    const { price } = await db.from('products').where('id', productId).firstOrFail()

    const unitPrice = Number(price)
    const totalAmount = Number(price * quantity)

    const sale = await db.transaction(async (trx) => {
      return await Sale.create({ ...payload, unitPrice, totalAmount }, { client: trx })
    })

    logger.info(`Sale created successfully: ${JSON.stringify(sale)}`)

    return response.created({
      message: i18n.t('sale_messages.create.success'),
      sale: serializeSaleCreated(sale),
    })
  }

  /**
   * Show details of a sale by its ID.
   * *
   * @param {HttpContext} ctx - The context object.
   * @param {Object} ctx.params - The route parameters.
   * @param {Object} ctx.response - The HTTP response object.
   * @param {Object} ctx.i18n - The i18n localization object.
   * @returns Sale JSON object with success message and sale details.
   */
  async show({ params, response, i18n }: HttpContext) {
    const sale = await Sale.query()
      .where('id', params.id)
      .preload('product')
      .preload('customer')
      .firstOrFail()

    return response.ok({
      message: i18n.t('sale_messages.detail.success'),
      sale: serializeSale(sale),
    })
  }
}
