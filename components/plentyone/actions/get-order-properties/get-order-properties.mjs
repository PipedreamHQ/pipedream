import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-get-order-properties",
  name: "Get Order Properties",
  description: "Retrieves properties for a specific order from PlentyONE [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Order/get_rest_orders__orderId_)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.plentyone.getOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved properties for order with ID: ${this.orderId}`);
    return response.properties;
  },
};
