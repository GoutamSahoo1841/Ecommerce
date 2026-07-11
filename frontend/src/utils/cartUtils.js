export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  const items = state.isBuyNow && state.buyNowItem ? [state.buyNowItem] : state.cartItems;

  // Calculate items price
  const itemsPrice = items.reduce(
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

  // Save to localStorage under user-scoped key
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const cartKey = userInfo ? `cart_${userInfo._id}` : 'cart_guest';
  localStorage.setItem(cartKey, JSON.stringify(state));

  // Also save to generic 'cart' key for compatibility/failsafe if needed, or remove it.
  // We will keep writing it to user-scoped key only as requested.

  return state;
};
