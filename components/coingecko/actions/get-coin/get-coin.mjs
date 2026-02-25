import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-get-coin",
  name: "Get Coin",
  description: "Get current data for a coin by its ID, including price, market cap, volume, community data, and developer data. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/coins-id)",
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
    localization: {
      type: "boolean",
      label: "Include Localization",
      description: "Include all localized language data in the response.",
      optional: true,
    },
    tickers: {
      type: "boolean",
      label: "Include Tickers",
      description: "Include ticker and exchange data in the response.",
      optional: true,
    },
    marketData: {
      type: "boolean",
      label: "Include Market Data",
      description: "Include market data (price, market cap, volume, etc.) in the response.",
      optional: true,
    },
    communityData: {
      type: "boolean",
      label: "Include Community Data",
      description: "Include community data (Reddit, Twitter, Telegram) in the response.",
      optional: true,
    },
    developerData: {
      type: "boolean",
      label: "Include Developer Data",
      description: "Include developer/GitHub data (forks, stars, commits) in the response.",
      optional: true,
    },
    sparkline: {
      type: "boolean",
      label: "Include Sparkline",
      description: "Include 7-day sparkline price data in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      coinId,
      localization,
      tickers,
      marketData,
      communityData,
      developerData,
      sparkline,
    } = this;
    const response = await this.app.getCoin({
      $,
      coinId,
      params: {
        localization,
        tickers,
        market_data: marketData,
        community_data: communityData,
        developer_data: developerData,
        sparkline,
      },
    });
    $.export("$summary", `Successfully retrieved data for ${response.name} (${response.symbol?.toUpperCase()})`);
    return response;
  },
};
