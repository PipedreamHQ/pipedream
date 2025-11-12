import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-discount-rate",
  name: "Future - Market - Get Discount Rate",
  description: "Retrieve discount rate information for contract trading. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-Discount-Rate)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getFutureMarketDiscountRate({
      $,
    });

    $.export("$summary", `Successfully retrieved discount rate information with \`${response?.data?.length}\` record(s)`);
    return response;
  },
};
