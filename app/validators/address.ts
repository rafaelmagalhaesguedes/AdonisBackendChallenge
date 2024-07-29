import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    street: vine.string().trim().minLength(3).maxLength(64),
    number: vine.string().trim().minLength(1).maxLength(100000),
    complement: vine.string().trim().minLength(1).maxLength(255),
    neighborhood: vine.string().trim().minLength(3).maxLength(64),
    city: vine.string().trim().minLength(3).maxLength(64),
    state: vine.string().trim().minLength(2).maxLength(255),
    zipCode: vine.string().trim().minLength(8).maxLength(8),
    country: vine.string().trim().minLength(2).maxLength(255),
  })
)
