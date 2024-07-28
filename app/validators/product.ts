import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().minLength(3).maxLength(255),
    price: vine.number().min(0),
    category: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number().min(0).max(1000),
    image: vine.string().trim().minLength(3).maxLength(255),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().minLength(3).maxLength(255).optional(),
    price: vine.number().min(0).optional(),
    category: vine.string().trim().minLength(3).maxLength(255).optional(),
    stock: vine.number().min(0).max(1000).optional(),
    image: vine.string().trim().minLength(3).maxLength(255).optional(),
  })
)
