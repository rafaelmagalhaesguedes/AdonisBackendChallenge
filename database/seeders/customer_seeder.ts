import Customer from '#models/customer'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Customer.createMany([
      {
        name: 'Cliente Exemplo',
        email: 'client@client.com',
        cpf: '123.456.789-00',
      },
      {
        name: 'Cliente Teste',
        email: 'client2@client.com',
        cpf: '987.654.321-00',
      },
      {
        name: 'Cliente 3',
        email: 'client3@client.com',
        cpf: '123.123.123-00',
      },
      {
        name: 'Cliente 4',
        email: 'client4@client.com',
        cpf: '123.123.123-01',
      },
    ])
  }
}
