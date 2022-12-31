export const formatPrice = (price: number) => {
  const options = {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }

  return price.toLocaleString('es-AR', options)
}
