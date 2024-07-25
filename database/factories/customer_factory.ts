import factory from '@adonisjs/lucid/factories'
import Customer from '#models/customer'

export const CustomerFactory = factory
  .define(Customer, async ({ faker }) => {
    return {
      name: faker.person.firstName(),
      email: `${faker.internet.userName()}+${Date.now()}@example.com`,
      cpf: faker.helpers.replaceSymbols('###.###.###-##'),
    }
  })
  .build()
