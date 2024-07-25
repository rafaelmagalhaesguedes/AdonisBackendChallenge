import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')

const ProductsController = () => import('#controllers/products_controller')

const CustomersController = () => import('#controllers/customers_controller')

router
  .group(() => {
    router.post('signup', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('auth')

router
  .group(() => {
    router.get('list', [ProductsController, 'index']).use(middleware.auth())
    router.post('create', [ProductsController, 'store']).use(middleware.auth())
    router.get('details/:id', [ProductsController, 'show']).use(middleware.auth())
    router.patch('update/:id', [ProductsController, 'update']).use(middleware.auth())
    router.delete('delete/:id', [ProductsController, 'destroy']).use(middleware.auth())
  })
  .prefix('products')

router
  .group(() => {
    router.get('list', [CustomersController, 'index']).use(middleware.auth())
    router.post('create', [CustomersController, 'store']).use(middleware.auth())
    router.get('details/:id', [CustomersController, 'show']).use(middleware.auth())
    router.patch('update/:id', [CustomersController, 'update']).use(middleware.auth())
    router.delete('delete/:id', [CustomersController, 'destroy']).use(middleware.auth())
  })
  .prefix('customers')
