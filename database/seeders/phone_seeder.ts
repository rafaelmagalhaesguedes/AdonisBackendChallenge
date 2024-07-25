import Phone from '#models/phone'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PhoneSeeder extends BaseSeeder {
  async run() {
    await Phone.createMany([
      {
        customerId: 1,
        number: '55 00 999888 1233',
        type: 'Mobile',
      },
      {
        customerId: 1,
        number: '55 00 999888 1234',
        type: 'Work',
      },
      {
        customerId: 2,
        number: '55 00 999773 1234',
        type: 'Home',
      },
      {
        customerId: 2,
        number: '55 00 999773 1234',
        type: 'Mobile',
      },
      {
        customerId: 3,
        number: '55 00 999773 1234',
        type: 'Work',
      },
      {
        customerId: 4,
        number: '55 00 999773 1234',
        type: 'Mobile',
      },
    ])
  }
}
