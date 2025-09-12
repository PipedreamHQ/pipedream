import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-trade-cancel-symbol-orders",
  name: "Spot - Trade - Cancel Symbol Orders",
  description: "Cancel all orders for a specific symbol. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Cancel-Symbol-Orders)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
    } = this;

    const response = await app.cancelSpotTradeSymbolOrders({
      $,
      data: {
        symbol,
      },
    });

    $.export("$summary", `Successfully cancelled all orders for symbol \`${symbol}\``);
    return response;
  },
};
