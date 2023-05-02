import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "utradea",
  propDefinitions: {
    sentiment: {
      type: "string",
      label: "Sentiment",
      description: "The sentiment to search for.",
      options: Object.values(constants.SENTIMENT),
    },
    timeInterval: {
      type: "string",
      label: "Time Interval",
      description: "The time interval to search for.",
    },
    tickers: {
      type: "string",
      label: "Tickers",
      description: "The company OR crypto symbol, as it is defined in Utradea. To pass multiple symbols, use a comma to seperate tickers.",
    },
    social: {
      type: "string",
      label: "Social Media",
      description: "The social media source to search.",
      options: Object.values(constants.SOCIAL_MEDIA),
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "Enter an integer timestamp option (such as timestamp=24h) to return snapshots of posts, comments, likes, and impressions grouped by the given time interval increments that fall within the specified timeframe.",
    },
    isCrypto: {
      type: "boolean",
      label: "Is Crypto",
      description: "Specify stock or cryptocurrency ticker sentiment change results. `false` is for **Stocks** while if `true` is for **Cryptocurrencies**.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Enter an integer limit option to filter the number of results returned from this query. If no limit is specified, the default is set to 50.",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": this.$auth.api_key,
        ...headers,
      };
    },
    listSocialNotifications(args = {}) {
      return this.makeRequest({
        path: "/get-social-notifications",
        ...args,
      });
    },
    listContent(args = {}) {
      return this.makeRequest({
        path: "/get-content",
        ...args,
      });
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
    }) {
      const nextResources = await resourceFn(resourceFnArgs);

      if (!nextResources?.length) {
        console.log("No more resources found");
        return;
      }

      for (const resource of nextResources) {
        yield resource;
      }
    },
  },
};
