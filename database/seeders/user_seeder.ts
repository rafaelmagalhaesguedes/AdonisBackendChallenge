import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'Admin',
        email: 'admin@admin.com',
        password: 'secret_admin',
      },
      {
        fullName: 'User',
        email: 'user@user.com',
        password: 'secret_user',
      },
    ])
  }
}
