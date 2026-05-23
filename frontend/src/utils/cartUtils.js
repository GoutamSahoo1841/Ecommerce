export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate discount price
  const discountPrice = state.discountPercentage 
    ? (itemsPrice * state.discountPercentage) / 100 
    : 0;
  state.discountPrice = addDecimals(discountPrice);

  const discountedItemsPrice = itemsPrice - discountPrice;

  // Calculate shipping price (If discounted order is > $100 then free, else $10 shipping)
  const shippingPrice = discountedItemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPrice);

  // Calculate tax price (15% tax)
  const taxPrice = 0.15 * discountedItemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  // Calculate total price
  const totalPrice = discountedItemsPrice + shippingPrice + taxPrice;
  state.totalPrice = addDecimals(totalPrice);

  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
