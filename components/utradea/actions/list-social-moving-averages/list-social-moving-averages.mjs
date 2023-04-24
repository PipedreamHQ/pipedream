import app from "../../utradea.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "utradea-list-social-moving-averages",
  name: "List Social Moving Averages",
  description: "Search for a ticker and capture the moving average of posts, comments, likes, and impressions within a specified timeframe. [See the documentation here](https://utradea.com/api-docs#social-moving-averages-75).",
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
        constants.TIMEFRAME["72H"],
        constants.TIMEFRAME["1W"],
        constants.TIMEFRAME["2W"],
        constants.TIMEFRAME["1M"],
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
      propDefinition: [
        app,
        "timestamp",
      ],
      options: [
        constants.TIMEFRAME["72H"],
        constants.TIMEFRAME["24H"],
        constants.TIMEFRAME["1W"],
      ],
    },
  },
  methods: {
    listSocialMovingAverages({
      timeInterval, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/get-social-moving-averages/${timeInterval}`,
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

    const response = await this.listSocialMovingAverages({
      step,
      timeInterval,
      params: {
        tickers,
        social,
        timestamp,
      },
    });

    step.export("$summary", `Successfully retrieved ${response.length} social moving average(s).`);

    return response;
  },
};
