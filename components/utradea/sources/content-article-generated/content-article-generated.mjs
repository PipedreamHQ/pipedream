import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "utradea-content-article-generated",
  name: "New Content Article Generated",
  description: "Emit new event when a new content article is generated for a given stock or cryptocurrency. [See the documentation here](https://utradea.com/api-docs#content-notifications-*-new-140).",
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
      return this.app.listContent;
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
      return {
        id: resource._id,
        summary: `New Content: ${resource.title}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
