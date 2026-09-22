import app from "../../billbee.app.mjs";

export default {
  key: "billbee-get-order-by-id",
  name: "Get Order By ID",
  description: "Retrieve a specific order by its ID from Billbee. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_Get)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      orderId,
    } = this;

    const response = await app.getOrder({
      $,
      orderId,
    });

    $.export("$summary", `Successfully retrieved order with ID \`${response.Data?.BillBeeOrderId}\``);

    return response;
  },
};
