import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-get-order-details",
  name: "Get Order Details",
  description: "Get the details of the specified order. [See the documentation](https://www.remoteretrieval.com/api-integration/#order-detail)",
  version: "0.0.2",
  type: "action",
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
    const response = await this.app.getOrderDetails({
      $,
      params: {
        ORDER_ID: this.orderId,
      },
    });
    $.export("$summary", `Successfully retrieved details of order with ID '${this.orderId}'`);
    return response;
  },
};
