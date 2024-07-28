import Sale from '#models/sale'
import Factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'

export const SaleFactory = Factory.define(Sale, ({ faker }) => {
  return {
    customerId: faker.number.int({ min: 1, max: 1000 }),
    productId: faker.number.int({ min: 1, max: 1000 }),
    quantity: faker.number.int({ min: 1, max: 1000 }),
    unitPrice: faker.number.float({ min: 10, max: 1000, multipleOf: 0.02 }),
    totalAmount: faker.number.float({ min: 10, max: 10000, multipleOf: 0.02 }),
    createdAt: DateTime.fromJSDate(faker.date.recent()),
  }
}).build()
