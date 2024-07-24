import Product from '#models/product'
import Factory from '@adonisjs/lucid/factories'

export const ProductFactory = Factory.define(Product, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number.parseFloat(faker.commerce.price()),
    category: faker.commerce.department(),
    stock: Math.floor(Math.random() * 100),
    image: faker.lorem.word(),
  }
}).build()
