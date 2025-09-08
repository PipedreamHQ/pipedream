import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-vip-fee-rate",
  name: "Future - Market - Get VIP Fee Rate",
  description: "Retrieve VIP fee rate information for contract trading. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-VIP-Fee-Rate)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getFutureMarketVipFeeRate({
      $,
    });

    $.export("$summary", `Successfully retrieved VIP fee rate information with \`${response?.data?.length}\` record(s)`);
    return response;
  },
};
