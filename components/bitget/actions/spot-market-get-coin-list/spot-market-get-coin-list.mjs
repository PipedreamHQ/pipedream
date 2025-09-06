import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-coin-list",
  name: "Spot - Market - Get Coin List",
  description: "Get spot coin information,supporting both individual and full queries. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Coin-List)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    coin: {
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

    const response = await app.getSpotMarketCoins({
      $,
      params: {
        coin,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` coin(s).`);

    return response;
  },
};

