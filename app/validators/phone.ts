import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    number: vine.string().trim().minLength(8).maxLength(17),
    type: vine.string().minLength(3).maxLength(20),
  })
)
