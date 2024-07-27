import { DateTime } from 'luxon'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { createValidator, updateValidator } from '#validators/product'

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

    const { id, name, description, price, category, stock, image, createdAt } = product

    return response.created({
      message: i18n.t('product_messages.create.success'),
      product: { id, name, description, price, category, stock, image, createdAt },
    })
  }

  async show({ params, response, i18n }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deletedAt')
      .select('id', 'name', 'description', 'price', 'category', 'stock', 'image', 'createdAt')
      .firstOrFail()

    return response.ok({
      message: i18n.t('product_messages.detail.success'),
      product,
    })
  }

  async update({ params, request, response, i18n }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(updateValidator)

    if (product.deletedAt !== null) {
      return response.notFound({ error: { message: i18n.t('product_messages.error.not_found') } })
    }

    product.merge(payload)
    await product.save()
    product.refresh()

    const { id, name, description, price, category, stock, image, updatedAt } = product

    return response.ok({
      message: i18n.t('product_messages.update.success'),
      product: { id, name, description, price, category, stock, image, updatedAt },
    })
  }

  async destroy({ params, response, i18n }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    if (product.deletedAt !== null) {
      return response.notFound({ error: { message: i18n.t('product_messages.error.not_found') } })
    }

    product.deletedAt = DateTime.fromJSDate(new Date())
    await product.save()

    return response.ok({
      message: i18n.t('product_messages.delete.success'),
      deletedAt: product.deletedAt,
    })
  }
}
