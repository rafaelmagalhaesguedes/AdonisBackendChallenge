import Sale from '#models/sale'
import { format } from 'date-fns'
import Product from '#models/product'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'
import { createValidator } from '#validators/sale'
import type { HttpContext } from '@adonisjs/core/http'
import { serializeCustomer } from '#database/serialize/customer_serialize'

export default class SalesController {
  async store({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)

    await db.transaction(async (trx) => {
      const [customer, product] = await this.getCustomerAndProduct(payload, trx)
      try {
        const totalAmount = this.getTotalAmount(product.price, payload.quantity)

        const newSale = { ...payload, unitPrice: product.price, totalAmount }
        const { id, quantity, createdAt } = await Sale.create(newSale, { client: trx })

        const saleDate = this.getFormatDate(createdAt.toJSDate())
        const formattedSale = { id, quantity, totalAmount, saleDate, product, customer }

        return response.created({
          message: i18n.t('sale_messages.create.success'),
          sale: formattedSale,
        })
      } catch (error) {
        await trx.rollback()
        return response.internalServerError({
          message: i18n.t('sale_messages.error.internal_error'),
          error: error.message,
        })
      }
    })
  }

  private async getCustomerAndProduct(payload: any, trx: any) {
    return Promise.all([
      this.getCustomer(payload.customerId, trx),
      this.getProduct(payload.productId, trx),
    ])
  }

  private getTotalAmount(price: number, quantity: number) {
    return price * quantity
  }

  private getFormatDate(date: Date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  }

  private async getCustomer(customerId: number, trx: any) {
    const customer = await Customer.query({ client: trx })
      .where('id', customerId)
      .select('id', 'name', 'email')
      .preload('phones')
      .preload('addresses')
      .firstOrFail()

    return serializeCustomer(customer)
  }

  private async getProduct(productId: number, trx: any) {
    const product = await Product.query({ client: trx })
      .where('id', productId)
      .select('name', 'price', 'category')
      .firstOrFail()

    return {
      id: productId,
      name: product.name,
      price: product.price,
      category: product.category,
    }
  }
}
