export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {
  // Calculate item price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )

  // Calculate shipping price (if order is over $100 then free, else $10 shipping)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)

  // Calculate tax price (15% tax)
  state.taxPrice = addDecimals(0.15 * state.itemsPrice)

  // Calculate total price (items price + shipping price + tax price)
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
  )

  localStorage.setItem('cart', JSON.stringify(state))

  return state
}
