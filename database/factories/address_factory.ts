import factory from '@adonisjs/lucid/factories'
import Address from '#models/address'

export const AddressFactory = factory
  .define(Address, async ({ faker }) => {
    return {
      street: faker.string.alpha(20),
      number: faker.string.alpha(10),
      complement: faker.string.alpha(20),
      neighborhood: faker.string.alpha(20),
      city: faker.string.alpha(20),
      state: faker.string.alpha(20),
      zipCode: faker.string.alpha(9),
      country: faker.string.alpha(20),
    }
  })
  .build()
