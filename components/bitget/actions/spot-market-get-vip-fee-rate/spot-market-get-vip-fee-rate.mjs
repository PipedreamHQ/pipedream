import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-vip-fee-rate",
  name: "Spot - Market - Get VIP Fee Rate",
  description: "Retrieve VIP fee rate information. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-VIP-Fee-Rate)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getSpotMarketVipFeeRate({
      $,
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.length}\` VIP levels`);
    return response;
  },
};

