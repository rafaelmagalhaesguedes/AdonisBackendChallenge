import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

const UsersController = () => import('#controllers/users_controller')

const ProductsController = () => import('#controllers/products_controller')

const CustomersController = () => import('#controllers/customers_controller')

const AddressesController = () => import('#controllers/addresses_controller')

const SalesController = () => import('#controllers/sales_controller')

router
  .group(() => {
    router.post('signup', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.delete('logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('auth')

router
  .group(() => {
    router.get('details/:id', [UsersController, 'show']).use(middleware.auth())
    router.patch('update/:id', [UsersController, 'update']).use(middleware.auth())
    router.delete('delete/:id', [UsersController, 'destroy']).use(middleware.auth())
  })
  .prefix('users')

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

router
  .group(() => {
    router.post('create/:customerId', [AddressesController, 'store']).use(middleware.auth())
    router
      .patch('update/:id/customer/:customerId', [AddressesController, 'update'])
      .use(middleware.auth())
    router
      .delete('delete/:id/customer/:customerId', [AddressesController, 'destroy'])
      .use(middleware.auth())
  })
  .prefix('address')

router
  .group(() => {
    router.get('list', [SalesController, 'index']).use(middleware.auth())
    router.post('create', [SalesController, 'store']).use(middleware.auth())
    router.get('details/:id', [SalesController, 'show']).use(middleware.auth())
  })
  .prefix('sales')
