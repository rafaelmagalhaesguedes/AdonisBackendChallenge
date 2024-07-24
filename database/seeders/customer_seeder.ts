import Customer from '#models/customer'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Customer.createMany([
      {
        name: 'Cliente Exemplo',
        cpf: '123.456.789-00',
      },
      {
        name: 'Cliente Teste',
        cpf: '987.654.321-00',
      },
    ])
  }
}
