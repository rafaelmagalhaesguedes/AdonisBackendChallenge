import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    customerId: vine.number().positive(),
    productId: vine.number().positive(),
    quantity: vine.number().positive().min(1).max(100),
  })
)
