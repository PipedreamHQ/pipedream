import oto from "../../oto.app.mjs";

export default {
  key: "oto-get-order-details",
  name: "Get Order Details",
  description: "Provides detailed information about a specific order. [See the documentation](https://apis.tryoto.com/#53964419-2d64-4c07-b39d-b26a92b379c9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    oto,
    orderId: {
      propDefinition: [
        oto,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.oto.getOrderDetails({
      $,
      params: {
        orderId: this.orderId,
      },
    });
    $.export("$summary", `Successfully retrieved details for order with ID: ${this.orderId}`);
    return response;
  },
};
