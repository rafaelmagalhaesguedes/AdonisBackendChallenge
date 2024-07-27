import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
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
    name: vine.string().trim().minLength(3).maxLength(255),
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
