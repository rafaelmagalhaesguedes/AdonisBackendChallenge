import Address from '#models/address'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AddressSeeder extends BaseSeeder {
  async run() {
    await Address.createMany([
      {
        customerId: 1,
        street: '123 Main St',
        number: '100',
        complement: 'Apt 101',
        neighborhood: 'Downtown',
        city: 'Cityville',
        state: 'Stateville',
        zipCode: '12345',
        country: 'Countryland',
      },
      {
        customerId: 2,
        street: '222 Main St',
        number: '22',
        complement: 'Apt 22',
        neighborhood: 'Downtown',
        city: 'Cityville',
        state: 'Regionstate',
        zipCode: '12345',
        country: 'Countryland',
      },
      {
        customerId: 3,
        street: '333 Main St',
        number: '33',
        complement: 'Apt 33',
        neighborhood: 'Downtown',
        city: 'Cityville',
        state: 'Regionstate',
        zipCode: '12345',
        country: 'Countryland',
      },
      {
        customerId: 4,
        street: '444 Main St',
        number: '44',
        complement: 'Apt 44',
        neighborhood: 'Downtown',
        city: 'Cityville',
        state: 'Regionstate',
        zipCode: '12345',
        country: 'Countryland',
      },
    ])
  }
}
