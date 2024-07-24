import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number

  @column()
  declare street: string

  @column()
  declare number: string

  @column()
  declare complement: string

  @column()
  declare neighborhood: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column()
  declare zipCode: string

  @column()
  declare country: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
