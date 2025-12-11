import app from "../../picqer.app.mjs";

export default {
  key: "picqer-pause-order",
  name: "Pause Order",
  description: "Suspends processing of orders with 'processing' status. Pauses underlying picklists. [See the documentation](https://picqer.com/en/api/orders)",
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
    reason: {
      type: "string",
      label: "Reason",
      description: "A reason for pausing the order",
    },
  },
  async run({ $ }) {
    const response = await this.app.pauseOrder({
      $,
      orderId: this.orderId,
      data: {
        reason: this.reason,
      },
    });

    $.export("$summary", `Successfully paused order ${this.orderId}`);
    return response;
  },
};
