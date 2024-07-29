import factory from '@adonisjs/lucid/factories'
import Phone from '#models/phone'

export const PhoneFactory = factory
  .define(Phone, async ({ faker }) => {
    return {
      number: faker.phone.number(),
      type: faker.lorem.words(),
    }
  })
  .build()
