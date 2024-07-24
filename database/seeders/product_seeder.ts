import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 99.99,
        category: 'Category 1',
        stock: 10,
        image: 'http://example.com/product1.jpg',
      },
      {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 199.99,
        category: 'Category 2',
        stock: 5,
        image: 'http://example.com/product2.jpg',
      },
      {
        name: 'Product 3',
        description: 'Description for product 3',
        price: 299.99,
        category: 'Category 3',
        stock: 15,
        image: 'http://example.com/product3.jpg',
      },
      {
        name: 'Product 4',
        description: 'Description for product 4',
        price: 399.99,
        category: 'Category 4',
        stock: 20,
        image: 'http://example.com/product4.jpg',
      },
      {
        name: 'Product 5',
        description: 'Description for product 5',
        price: 499.99,
        category: 'Category 5',
        stock: 25,
        image: 'http://example.com/product5.jpg',
      },
    ])
  }
}
