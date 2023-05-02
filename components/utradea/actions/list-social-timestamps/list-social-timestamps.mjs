import constants from "../../common/constants.mjs";
import app from "../../utradea.app.mjs";

export default {
  key: "utradea-list-social-timestamps",
  name: "List Social Timestamps",
  description: "Search for a ticker and capture the total posts, comments, likes, impressions over a specified timeframe. [See the documentation here](https://utradea.com/api-docs#social-timestamps-61).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    timeInterval: {
      propDefinition: [
        app,
        "timeInterval",
      ],
      options: [
        constants.TIMEFRAME["15m"],
        constants.TIMEFRAME["30m"],
        constants.TIMEFRAME["1H"],
        constants.TIMEFRAME["4H"],
        constants.TIMEFRAME["1D"],
      ],
    },
    tickers: {
      propDefinition: [
        app,
        "tickers",
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
      propDefinition: [
        app,
        "timestamp",
      ],
      options: [
        constants.TIMEFRAME["24H"],
        constants.TIMEFRAME["72H"],
        constants.TIMEFRAME["1W"],
        constants.TIMEFRAME["2W"],
        constants.TIMEFRAME["1M"],
        constants.TIMEFRAME["3M"],
      ],
    },
  },
  methods: {
    listSocialTimestamps({
      timeInterval, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/get-social-timestamps/${timeInterval}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      timeInterval,
      tickers,
      social,
      timestamp,
    } = this;

    const response = await this.listSocialTimestamps({
      step,
      timeInterval,
      params: {
        tickers,
        social,
        timestamp,
      },
    });

    step.export("$summary", `Successfully retrieved ${response.length} social timestamp(s).`);

    return response;
  },
};
