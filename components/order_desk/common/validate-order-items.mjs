export const getParsedOrderItems = (orderItems) => {
  const orderItemsParsed = [];
  for (let i = 0; i < orderItems.length; i++) {
    try {
      orderItemsParsed.push(JSON.parse(orderItems[i]));
    } catch (err) {
      throw new Error(`Invalid JSON string for ordem_item at index ${i}: ${orderItems[i]}`);
    }
  }
  return orderItemsParsed;
};
