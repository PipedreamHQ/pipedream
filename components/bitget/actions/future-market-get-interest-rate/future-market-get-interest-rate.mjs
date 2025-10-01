import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-interest-rate",
  name: "Future - Market - Get Interest Rate",
  description: "Get interest rate history for a specific coin asset. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Interest-Rate)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    coin: {
      optional: false,
      propDefinition: [
        app,
        "coin",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      coin,
    } = this;

    const response = await app.getFutureMarketInterestRate({
      $,
      params: {
        coin,
      },
    });

    $.export("$summary", `Successfully retrieved interest rate history for \`${coin}\` with \`${response?.data?.historyInterestRateList?.length}\` record(s)`);
    return response;
  },
};
