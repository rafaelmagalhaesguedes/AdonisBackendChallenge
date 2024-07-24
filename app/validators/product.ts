import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().minLength(3).maxLength(255),
    price: vine.number().min(0),
    category: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number().min(0),
    image: vine.string().trim().minLength(3).maxLength(255),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().minLength(3).maxLength(255),
    price: vine.number().min(0),
    category: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number().min(0),
    image: vine.string().trim().minLength(3).maxLength(255),
  })
)
