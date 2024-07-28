import vine from '@vinejs/vine'

const quantity = vine.number().positive().min(1).max(100)

export const createValidator = vine.compile(
  vine.object({
    customerId: vine.number().positive(),
    productId: vine.number().positive(),
    quantity,
  })
)

export const updateValidator = vine.compile(
  vine.object({
    quantity,
  })
)
