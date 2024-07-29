import vine from '@vinejs/vine'

const name = vine.string().trim().minLength(3).maxLength(255)

export const createValidator = vine.compile(
  vine.object({
    name,
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const customer = await db.from('customers').where('email', value).first()
        return !customer
      }),
    cpf: vine
      .string()
      .trim()
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
      .unique(async (db, value) => {
        const customer = await db.from('customers').where('cpf', value).first()
        return !customer
      }),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name,
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const customer = await db.from('customers').where('email', value).first()
        return !customer
      }),
    cpf: vine
      .string()
      .trim()
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
      .unique(async (db, value) => {
        const customer = await db.from('customers').where('cpf', value).first()
        return !customer
      }),
  })
)

export const createAddressValidator = vine.compile(
  vine.object({
    street: vine.string().trim().minLength(3).maxLength(64),
    number: vine.string().trim().minLength(1).maxLength(1000),
    complement: vine.string().trim().minLength(1).maxLength(255),
    neighborhood: vine.string().trim().minLength(3).maxLength(64),
    city: vine.string().trim().minLength(3).maxLength(64),
    state: vine.string().trim().minLength(2).maxLength(255),
    zipCode: vine.string().trim().minLength(8).maxLength(8),
    country: vine.string().trim().minLength(2).maxLength(255),
  })
)
