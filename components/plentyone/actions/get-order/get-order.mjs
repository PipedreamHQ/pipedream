import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-get-order",
  name: "Get Order",
  description: "Retrieves a specific order by ID from PlentyONE. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/get_rest_orders__orderId_)",
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
      });

      $.export("$summary", `Successfully retrieved order: ${this.orderId}`);
      return response;
    } catch (error) {
      $.export("$summary", `No order found with ID: ${this.orderId}`);
      return {};
    }
  },
};
