import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('customer_id')
        .unsigned()
        .references('id')
        .inTable('customers')
        .onDelete('CASCADE')
      table.string('street', 255).notNullable()
      table.string('number', 50).notNullable()
      table.string('complement', 255)
      table.string('neighborhood', 255).notNullable()
      table.string('city', 255).notNullable()
      table.string('state', 255).notNullable()
      table.string('zip_code', 20).notNullable()
      table.string('country', 255).notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
