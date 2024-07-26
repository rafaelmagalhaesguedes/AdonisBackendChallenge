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
        totalAmount: 200.0,
      },
      {
        customerId: 1,
        productId: 2,
        quantity: 1,
        unitPrice: 150.0,
        totalAmount: 150.0,
      },
      {
        customerId: 2,
        productId: 2,
        quantity: 1,
        unitPrice: 150.0,
        totalAmount: 150.0,
      },
      {
        customerId: 3,
        productId: 1,
        quantity: 2,
        unitPrice: 100.0,
        totalAmount: 200.0,
      },
      {
        customerId: 4,
        productId: 4,
        quantity: 4,
        unitPrice: 250.0,
        totalAmount: 1000.0,
      },
      {
        customerId: 4,
        productId: 5,
        quantity: 2,
        unitPrice: 300.0,
        totalAmount: 600.0,
      },
      {
        customerId: 4,
        productId: 3,
        quantity: 1,
        unitPrice: 200.0,
        totalAmount: 200.0,
      },
    ])
  }
}
