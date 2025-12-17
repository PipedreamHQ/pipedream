import app from "../../returnless.app.mjs";

export default {
  key: "returnless-retrieve-sales-order",
  name: "Retrieve Sales Order",
  description: "Retrieve a sales order. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/4a6a8fe812c44-retrieve-a-sales-order)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const { data } = await this.app.getOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved sales order ${this.orderId}`);
    return data;
  },
};
