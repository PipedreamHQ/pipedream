import app from "../../alpaca.app.mjs";

export default {
  type: "action",
  key: "alpaca-cancel-order",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Cancel Order",
  description: "Attempts to cancel an open order. If the order is no longer cancelable (example: status=`filled`), the server will reject the request, [See the docs](https://alpaca.markets/docs/api-references/trading-api/orders/#cancel-an-order)",
  props: {
    app,
    isPaperAPI: {
      propDefinition: [
        app,
        "isPaperAPI",
      ],
    },
    orderId: {
      propDefinition: [
        app,
        "orderId",
        (configuredProps) => ({
          isPaperAPI: configuredProps.isPaperAPI,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const response = await this.app.cancelOrder({
      $,
      isPaperAPI: this.isPaperAPI,
      orderId: this.orderId,
    });
    $.export("$summary", `Order(ID:${this.orderId}) has been cancelled.`);
    return response;
  },
};
