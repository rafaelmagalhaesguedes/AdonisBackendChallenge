import Sale from '#models/sale'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Sale.createMany([
      {
        customerId: 1,
        productId: 1,
        quantity: 2,
        unitPrice: 100.0,
        totalPrice: 200.0,
      },
      {
        customerId: 2,
        productId: 2,
        quantity: 1,
        unitPrice: 150.0,
        totalPrice: 150.0,
      },
    ])
  }
}
