import Product from '#models/product'

/**
 * Serialize product data to customize the output.
 * @param product The product entity to serialize.
 * @returns The serialized product data.
 */
export function serializeProduct(product: Product) {
  return product.serialize({
    fields: ['id', 'name', 'description', 'price', 'category', 'stock'],
  })
}

/**
 * Serialize product data updated to customize the output.
 * @param product The product updated entity to serialize.
 * @returns The serialized product data updated.
 */
export function serializeProductUpdated(product: Product) {
  return product.serialize({
    fields: ['id', 'name', 'description', 'price', 'category', 'stock', 'image', 'updatedAt'],
  })
}
