import Sale from '#models/sale'

/**
 * Serialize sale data to customize the output.
 * @param sale The sale entity to serialize.
 * @returns The serialized sale data.
 */
export function serializeSale(sale: Sale) {
  return sale.serialize({
    fields: ['id', 'quantity', 'unitPrice', 'totalAmount', 'createdAt'],
    relations: {
      product: {
        fields: ['id', 'name', 'description', 'price'],
      },
      customer: {
        fields: ['id', 'name', 'email'],
        relations: {
          phones: {
            fields: ['number', 'type'],
          },
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
        },
      },
    },
  })
}

/**
 * Serialize sale data created to customize the output.
 * @param sale The sale created entity to serialize.
 * @returns The serialized sale data created.
 */
export function serializeSaleCreated(sale: Sale) {
  return sale.serialize({
    fields: ['id', 'customerId', 'productId', 'quantity', 'unitPrice', 'totalAmount', 'createdAt'],
  })
}

/**
 * Serialize sale data updated to customize the output.
 * @param sale The sale updated entity to serialize.
 * @returns The serialized sale data updated.
 */
export function serializeSaleUpdated(sale: Sale) {
  return sale.serialize({
    fields: ['id', 'customerId', 'productId', 'quantity', 'unitPrice', 'totalAmount', 'updatedAt'],
  })
}
