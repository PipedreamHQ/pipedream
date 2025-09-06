import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-get-order-items",
  name: "Get Order Items",
  description: "Retrieves items for a specific order from PlentyONE [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/get_rest_orders__orderId_)",
  version: "0.0.1",
  type: "action",
  props: {
    plentyone,
    orderId: {
      propDefinition: [
        plentyone,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.plentyone.getOrder({
        $,
        orderId: this.orderId,
        params: {
          addOrderItems: true,
        },
      });

      $.export("$summary", `Successfully retrieved ${response.orderItems.length} items for order: ${this.orderId}`);
      return response.orderItems;
    } catch (error) {
      $.export("$summary", `No items found for order: ${this.orderId}`);
      return {};
    }
  },
};
