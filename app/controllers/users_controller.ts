import bcrypt from 'bcrypt'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async create({ request, response }: HttpContext) {
    try {
      const { fullName, email, password } = request.only(['fullName', 'email', 'password'])

      const hashPassword = await bcrypt.hash(password, 10)

      const user = await User.create({ fullName, email, password: hashPassword })

      return response.status(201).send(user)
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error', error: error.message })
    }
  }
}
