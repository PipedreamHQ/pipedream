import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-symbols",
  name: "Spot - Market - Get Symbols",
  description: "Obtain all trading pair information on the platform. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Symbols)",
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

    const response = await app.getSpotMarketSymbols({
      $,
      params: {
        symbol,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` symbol(s).`);

    return response.data;
  },
};

