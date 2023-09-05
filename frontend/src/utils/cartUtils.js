// Helper function for 2 decimals point
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Shipping price i f order total price does not exceed Rs500 then Rs.40 shipping charges apply
  state.ShippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 40);

  // Tax price(10%)
  state.taxPrice = addDecimals(Number(0.1 * state.itemsPrice).toFixed(2));

  // Total price
  state.totalPrice = addDecimals(
    (
      Number(state.itemsPrice) +
      Number(state.ShippingPrice) +
      Number(state.taxPrice)
    ).toFixed(2)
  );
  return state;
};
