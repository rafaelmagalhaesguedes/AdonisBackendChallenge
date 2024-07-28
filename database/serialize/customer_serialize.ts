import Customer from '#models/customer'

/**
 * Serialize customer data to customize the output.
 * @param customer The customer entity to serialize.
 * @returns The serialized customer data.
 */
export function serializeCustomer(customer: Customer) {
  return customer.serialize({
    fields: ['id', 'name', 'email', 'cpf'],
    relations: {
      addresses: {
        fields: [
          'street',
          'number',
          'complement',
          'neighborhood',
          'city',
          'state',
          'zipCode',
          'country',
        ],
      },
      phones: {
        fields: ['number', 'type'],
      },
      sales: {
        fields: ['quantity', 'unitPrice', 'totalAmount', 'createdAt'],
        relations: {
          product: {
            fields: ['name', 'description', 'price'],
          },
        },
      },
    },
  })
}

/**
 * Serialize customer data created to customize the output.
 * @param customer The customer created entity to serialize.
 * @returns The serialized customer created data.
 */
export function serializeCustomerCreated(customer: Customer) {
  return customer.serialize({
    fields: ['id', 'name', 'email', 'cpf', 'createdAt'],
  })
}
