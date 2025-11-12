import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-orderbook",
  name: "Spot - Market - Get Orderbook",
  description: "Retrieve the order book depth for a specified symbol. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Orderbook)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    symbol: {
      optional: false,
      propDefinition: [
        app,
        "symbol",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The value of the order book depth type. Default: `step0`.",
      optional: true,
      options: [
        "step0",
        "step1",
        "step2",
        "step3",
        "step4",
        "step5",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `150`, maximum: `150`.",
      optional: true,
      min: 1,
      max: 150,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      type,
      limit,
    } = this;

    const response = await app.getSpotMarketOrderbook({
      $,
      params: {
        symbol,
        type,
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved order book depth for symbol \`${symbol}\``);
    return response;
  },
};
