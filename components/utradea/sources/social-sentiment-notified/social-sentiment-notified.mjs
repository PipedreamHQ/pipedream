import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "utradea-social-sentiment-notified",
  name: "New Social Sentiment Notified",
  description: "Emit new event when identify changes in social media activity for a given stock or cryptocurrency on Twitter or StockTwits, [See the documentation here](https://utradea.com/api-docs#social-notifications-*-new-139).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    tickers: {
      propDefinition: [
        common.props.app,
        "tickers",
      ],
    },
    social: {
      propDefinition: [
        common.props.app,
        "social",
      ],
    },
    timestamp: {
      description: "Enter an integer timestamp option (such as timestamp=24h) to return social notifications in the specified timeframe. Only `24h`,`72h` and `1w` are accepted timestamp options. If no timestamp is passed in the query parameter, the default is `24h`.",
      propDefinition: [
        common.props.app,
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
    ...common.methods,
    getResourceFn() {
      return this.app.listSocialNotifications;
    },
    getResourceFnArgs() {
      const {
        tickers,
        social,
        timestamp,
      } = this;

      const params = {
        tickers,
        social,
        timestamp,
      };

      const end = this.getLastEndTimestamp();

      if (!end) {
        return {
          params,
        };
      }

      return {
        params: {
          ...params,
          end,
        },
      };
    },
    compareFn(resourceA, resourceB) {
      return Date.parse(resourceA.createdAt) - Date.parse(resourceB.createdAt);
    },
    processLastResource(lastResource) {
      if (!lastResource) {
        return;
      }
      this.setLastEndTimestamp(lastResource.createdAt);
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.createdAt);
      return {
        id: ts,
        summary: `New Sentiment For: ${resource.ticker}`,
        ts,
      };
    },
  },
};
