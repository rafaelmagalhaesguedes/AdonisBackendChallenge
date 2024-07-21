import User from '#models/user'
import Joi from 'joi'

export const createUserValidator = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
    .external(async (email) => {
      const userExists = await User.findBy('email', email)
      if (userExists) {
        throw new Error('E-mail já está em uso')
      }
    }, 'Verificação de e-mail único'),
  password: Joi.string().min(6).required(),
})
