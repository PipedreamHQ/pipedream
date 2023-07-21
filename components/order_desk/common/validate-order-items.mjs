import { ConfigurationError } from "@pipedream/platform";

export const getParsedOrderItems = (orderItems) => {
  const orderItemsParsed = [];
  for (let i = 0; i < orderItems.length; i++) {
    let item;
    try {
      item = JSON.parse(orderItems[i]);
    } catch (err) {
      throw new Error(`Invalid JSON string for ordem_item at index ${i}: ${orderItems[i]}`);
    }

    if (Array.isArray(item)) {
      throw new ConfigurationError("You cant set an array as an order_item. If you want to send multiple items, please create a new child.");
    }
    orderItemsParsed.push(item);
  }
  return orderItemsParsed;
};
