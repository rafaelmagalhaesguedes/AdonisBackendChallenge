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
        fields: ['id', 'street', 'city', 'state'],
      },
      phones: {
        fields: ['id', 'number', 'type'],
      },
      sales: {
        fields: ['id', 'quantity', 'unitPrice', 'totalPrice', 'createdAt'],
        relations: {
          product: {
            fields: ['id', 'name', 'description', 'price'],
          },
        },
      },
    },
  })
}
