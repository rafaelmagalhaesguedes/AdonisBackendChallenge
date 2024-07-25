import Customer from '#models/customer'
import { createValidator, updateValidator } from '#validators/customer'
import type { HttpContext } from '@adonisjs/core/http'
import { serializeCustomer } from '#database/serialize/customer_serialize'

export default class CustomersController {
  /**
   * List all customers with pagination.
   * *
   * This method handles the listing of customer entities with pagination. It allows
   * querying a specific page and limit of customers to be returned. The response
   * includes a success message and the paginated list of customers.
   * *
   * @param HttpContext - The context of the HTTP request, including request, response, and i18n for localization.
   * @returns A response object containing a success message and the paginated customer data.
   */
  async index({ request, response, i18n }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const customers = await Customer.query()
      .select('id', 'name', 'email', 'cpf')
      .orderBy('id', 'asc')
      .paginate(page, limit)
      .then((pagination) => pagination.toJSON())

    return response.ok({
      message: i18n.t('customer.list.success'),
      customers: customers.data,
    })
  }

  /**
   * Create a new customer and return the created entity.
   * *
   * This method handles the creation of a new customer entity based on the provided payload.
   * It validates the incoming request data, creates a new customer in the database, and returns
   * a response with a success message along with the serialized data of the newly created customer.
   * *
   * @param HttpContext - The context of the HTTP request, including request, response, and i18n for localization.
   * @returns A response object containing a success message and the data of the newly created customer.
   */
  async store({ request, response, i18n }: HttpContext) {
    const payload = await request.validateUsing(createValidator)
    const { id, name, email, cpf } = await Customer.create(payload)

    return response.created({
      message: i18n.t('customer.create.success'),
      customer: { id, name, email, cpf },
    })
  }

  /**
   * Retrieve and serialize detailed customer data including sales filtered by month and year.
   * *
   * This method fetches a customer by ID and includes related entities such as addresses, phones,
   * and sales. Sales can be optionally filtered by month and year. The customer data is then
   * serialized to customize the output format before being returned in the response.
   * *
   * @param HttpContext - The context of the HTTP request, including parameters, request data, response object, and localization.
   *   - params: Contains route parameters, including the customer ID.
   *   - request: The request object to access query parameters like 'month' and 'year'.
   *   - response: The response object to send back the serialized customer data.
   *   - i18n: Localization object for internationalization.
   * @returns A response object with a success message and the serialized customer data.
   */
  async show({ params, request, response, i18n }: HttpContext) {
    const month = request.input('month')
    const year = request.input('year')

    const customer = await Customer.query()
      .where('id', params.id)
      .select('id', 'name', 'email', 'cpf')
      .preload('addresses')
      .preload('phones')
      .preload('sales', (salesQuery) => {
        salesQuery.orderBy('createdAt', 'desc')
        if (month && year) {
          salesQuery.whereRaw('MONTH(createdAt) = ? AND YEAR(createdAt) = ?', [month, year])
        }
        salesQuery.preload('product')
      })
      .firstOrFail() // Throws an exception if no record is found

    const serializedCustomer = serializeCustomer(customer)

    return response.ok({
      message: i18n.t('customer.detail.success'),
      customer: serializedCustomer,
    })
  }

  /**
   * Update a customer's details.
   * *
   * This method is responsible for updating the details of an existing customer in the database.
   * It first finds the customer by the provided ID, validates the incoming request data against
   * a predefined validator, merges the new data into the existing customer record, saves the changes,
   * and finally refreshes the customer instance. The updated customer data, including id, name, email,
   * and cpf, is then returned in the response along with a success message.
   * *
   * @param HttpContext - The context of the HTTP request, including route parameters, request data, response object, and localization.
   *   - params: Contains the route parameters, including the customer ID.
   *   - request: The request object, used here to validate and get the update payload.
   *   - response: The response object, used to send back the updated customer data.
   *   - i18n: Localization object for internationalization, used here for success message.
   * @returns A response object containing a success message and the updated customer data.
   */
  async update({ params, request, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const payload = await request.validateUsing(updateValidator)

    customer.merge(payload)
    await customer.save()
    customer.refresh()

    const { id, name, email, cpf } = customer

    return response.ok({
      message: i18n.t('customer.update.success'),
      customer: { id, name, email, cpf },
    })
  }

  /**
   * Deletes a customer and their related sales from the database.
   * *
   * This method is responsible for deleting a customer entity based on the provided ID. It first
   * retrieves the customer from the database to ensure it exists. Then, it deletes all sales related
   * to this customer to maintain database integrity. After deleting the related sales, it proceeds
   * to delete the customer itself. A success message is returned upon successful deletion.
   * *
   * @param HttpContext - The context of the HTTP request, including route parameters, response object, and localization.
   *   - params: Contains the route parameters, including the customer ID for deletion.
   *   - response: The response object, used to send back the success message.
   *   - i18n: Localization object for internationalization, used here for generating the success message.
   * @returns A response object containing a success message indicating the customer has been successfully deleted.
   */
  async destroy({ params, response, i18n }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)

    // Delete all related sales
    await customer.related('sales').query().delete()

    // Delete the customer
    await customer.delete()

    return response.ok({ message: i18n.t('customer.delete.success') })
  }
}
