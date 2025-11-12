import app from "../../alpaca.app.mjs";

export default {
  type: "action",
  key: "alpaca-close-all-positions",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Close All Positions",
  description: "Closes (liquidates) all of the account’s open long and short positions. A response will be provided for each order that is attempted to be cancelled. If an order is no longer cancelable, the server will reject the request, [See the docs](https://alpaca.markets/docs/api-references/trading-api/positions/#close-all-positions)",
  props: {
    app,
    isPaperAPI: {
      propDefinition: [
        app,
        "isPaperAPI",
      ],
    },
    cancelOrders: {
      propDefinition: [
        app,
        "cancelOrders",
      ],
    },
  },
  async run ({ $ }) {
    const response = await this.app.closeAllPositions({
      $,
      isPaperAPI: this.isPaperAPI,
      params: {
        cancel_orders: this.cancelOrders,
      },
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${response.length} position${response.length == 1 ? "" : "s"} has been closed.`);
    return response;
  },
};
