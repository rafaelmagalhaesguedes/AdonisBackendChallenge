import vine from '@vinejs/vine'

export const updateValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().trim().email().normalizeEmail(),
  })
)
