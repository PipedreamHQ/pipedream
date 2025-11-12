import app from "../../alpaca.app.mjs";

export default {
  type: "action",
  key: "alpaca-cancel-all-orders",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Cancel All Orders",
  description: "Attempts to cancel all open orders. A response will be provided for each order that is attempted to be cancelled. If an order is no longer cancelable, the server reject the request, [See the docs](https://alpaca.markets/docs/api-references/trading-api/orders/#cancel-all-orders)",
  props: {
    app,
    isPaperAPI: {
      propDefinition: [
        app,
        "isPaperAPI",
      ],
    },
  },
  async run ({ $ }) {
    const response = await this.app.cancelAllOrders({
      $,
      isPaperAPI: this.isPaperAPI,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${response.length} order${response.length == 1 ? "" : "s"} has been cancelled.`);
    return response;
  },
};
