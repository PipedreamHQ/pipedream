import constants from "../../common/constants.mjs";
import app from "../../utradea.app.mjs";

export default {
  key: "utradea-list-top-tickers-by-sentiment",
  name: "List Top Tickers By Sentiment",
  description: "Search for top 50 trending bullish/bearish stocks/crypto symbols on Twitter/StockTwits. [See the documentation here](https://utradea.com/api-docs#top-tickers-by-sentiment-115).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    sentiment: {
      propDefinition: [
        app,
        "sentiment",
      ],
    },
    isCrypto: {
      propDefinition: [
        app,
        "isCrypto",
      ],
    },
    social: {
      propDefinition: [
        app,
        "social",
      ],
    },
    timestamp: {
      optional: true,
      description: "Enter an integer timestamp option (such as timestamp=24h) to return snapshots of posts, comments, likes, and impressions that fall within the specified timeframe. Only `24h`, `72h` are accepted timestamp options. If you do not pass any value, the default timestamp is set to `24h`.",
      propDefinition: [
        app,
        "timestamp",
      ],
      options: [
        constants.TIMEFRAME["24H"],
        constants.TIMEFRAME["72H"],
      ],
    },
    limit: {
      optional: true,
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  methods: {
    listTopTickersBySentiment({
      sentiment, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/get-sentiment-tranding/${sentiment}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      sentiment,
      isCrypto,
      social,
      timestamp,
      limit,
    } = this;

    const response = await this.listTopTickersBySentiment({
      step,
      sentiment,
      params: {
        isCrypto,
        social,
        timestamp,
        limit,
      },
    });

    step.export("$summary", `Successfully retrieved ${response.length} top ticker(s) by sentiment.`);

    return response;
  },
};
