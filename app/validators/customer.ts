import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().email(),
    cpf: vine
      .string()
      .trim()
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    email: vine.string().email().optional(),
    cpf: vine
      .string()
      .trim()
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
      .optional(),
  })
)
