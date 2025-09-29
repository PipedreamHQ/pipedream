import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-exchange-rate",
  name: "Future - Market - Get Exchange Rate",
  description: "Get interest exchange rate information for contract trading. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Exchange-Rate)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getFutureMarketExchangeRate({
      $,
    });

    $.export("$summary", `Successfully retrieved exchange rate information with \`${response?.data?.length}\` record(s)`);
    return response;
  },
};
