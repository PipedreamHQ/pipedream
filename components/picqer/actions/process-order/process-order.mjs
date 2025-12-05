import app from "../../picqer.app.mjs";

export default {
  key: "picqer-process-order",
  name: "Process Order",
  description: "Finalizes a concept or expected order and creates picklists or backorders automatically. Note: The processing itself will take place in the background after you receive the response. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.processOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully initiated processing for order ${this.orderId}`);
    return response;
  },
};
