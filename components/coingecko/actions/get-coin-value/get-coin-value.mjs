import app from "../../coingecko.app.mjs";
import { parseStringList } from "../../common/utils.mjs";

export default {
  key: "coingecko-get-coin-value",
  name: "Get Coin Value",
  description: "Get the current price of one or more cryptocurrencies in any supported currencies. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/simple-price)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    vsCurrencies: {
      type: "string[]",
      label: "Target Currencies",
      description: "List of target currencies to convert to (e.g. `usd,eur,btc`).",
      propDefinition: [
        app,
        "vsCurrency",
      ],
    },
    ids: {
      type: "string[]",
      label: "Coin IDs",
      description: "List of coin IDs (e.g. `bitcoin,ethereum`)",
      optional: true,
      propDefinition: [
        app,
        "coinId",
      ],
    },
    includeMarketCap: {
      type: "boolean",
      label: "Include Market Cap",
      description: "Include market cap data in the response.",
      optional: true,
    },
    include24hrVol: {
      type: "boolean",
      label: "Include 24h Volume",
      description: "Include 24-hour trading volume in the response.",
      optional: true,
    },
    include24hrChange: {
      type: "boolean",
      label: "Include 24h Change",
      description: "Include 24-hour price change percentage in the response.",
      optional: true,
    },
    includeLastUpdatedAt: {
      type: "boolean",
      label: "Include Last Updated At",
      description: "Include the last updated UNIX timestamp in the response.",
      optional: true,
    },
    precision: {
      type: "string",
      label: "Precision",
      description: "Decimal precision for price values. Use `full` for full precision or a number from `0` to `18`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ids,
      vsCurrencies,
      includeMarketCap,
      include24hrVol,
      include24hrChange,
      includeLastUpdatedAt,
      precision,
    } = this;
    const response = await this.app.getCoinPrice({
      $,
      params: {
        vs_currencies: parseStringList(vsCurrencies),
        ids: parseStringList(ids),
        include_market_cap: includeMarketCap,
        include_24hr_vol: include24hrVol,
        include_24hr_change: include24hrChange,
        include_last_updated_at: includeLastUpdatedAt,
        precision,
      },
    });
    const coinCount = Object.keys(response).length;
    $.export("$summary", `Successfully retrieved prices for ${coinCount} coin${coinCount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
