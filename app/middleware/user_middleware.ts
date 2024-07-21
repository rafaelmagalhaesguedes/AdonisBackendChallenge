import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await createUserValidator.validateAsync(ctx.request.body())

      await next()
    } catch (error) {
      if (error.isJoi) {
        return ctx.response.status(400).send({ message: error.details[0].message })
      }
      return ctx.response.status(409).send({ message: error.message })
    }
  }
}
