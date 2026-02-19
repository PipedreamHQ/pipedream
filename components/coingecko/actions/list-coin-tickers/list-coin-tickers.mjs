import app from "../../coingecko.app.mjs";
import { parseStringList } from "../../common/utils.mjs";

export default {
  key: "coingecko-list-coin-tickers",
  name: "List Coin Tickers",
  description: "List trading tickers for a specified coin, including exchange info, price, volume, and trust score. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/coins-id-tickers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    coinId: {
      propDefinition: [
        app,
        "coinId",
      ],
    },
    exchangeIds: {
      type: "string[]",
      label: "Exchange IDs",
      description: "Filter tickers by exchange. Select one or more exchanges.",
      optional: true,
      propDefinition: [
        app,
        "exchangeId",
      ],
    },
    includeExchangeLogo: {
      type: "boolean",
      label: "Include Exchange Logo",
      description: "Include the exchange logo URL in the response.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for paginated results.",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order for tickers.",
      optional: true,
      options: [
        "trust_score_desc",
        "trust_score_asc",
        "volume_desc",
        "volume_asc",
      ],
    },
    depth: {
      type: "boolean",
      label: "Include Depth",
      description: "Include 2% orderbook depth (cost to move up/down) in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      coinId,
      exchangeIds,
      includeExchangeLogo,
      page,
      order,
      depth,
    } = this;
    const response = await this.app.getCoinTickers({
      $,
      coinId,
      params: {
        exchange_ids: parseStringList(exchangeIds),
        include_exchange_logo: includeExchangeLogo,
        page,
        order,
        depth,
      },
    });
    const count = response.tickers?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} tickers for ${coinId}`);
    return response;
  },
};
