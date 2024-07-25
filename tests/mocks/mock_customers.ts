import { faker } from '@faker-js/faker'

export const mockCustomerData = {
  name: faker.person.firstName(),
  email: `${faker.internet.userName()}+${Date.now()}@example.com`,
  cpf: faker.helpers.replaceSymbols('###.###.###-##'),
}

export const mockCustomerUpdateData = {
  name: faker.person.firstName(),
  email: `${faker.internet.userName()}+${Date.now()}@example.com`,
  cpf: faker.helpers.replaceSymbols('###.###.###-##'),
}

export const mockInvalidCustomerData = {
  name: 'New Customer',
  email: 'invalid-email',
  cpf: 'invalid-cpf',
}
