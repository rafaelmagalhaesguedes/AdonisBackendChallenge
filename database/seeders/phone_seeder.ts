import Phone from '#models/phone'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PhoneSeeder extends BaseSeeder {
  async run() {
    await Phone.createMany([
      {
        customerId: 1,
        countryCode: '+1',
        areaCode: '202',
        number: '5551234',
        type: 'Mobile',
      },
      {
        customerId: 2,
        countryCode: '+1',
        areaCode: '303',
        number: '5555678',
        type: 'Home',
      },
    ])
  }
}
