import { axios } from "@pipedream/platform";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 200, // 5 requests per second
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

export default {
  type: "app",
  app: "opensea",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.opensea.io/api/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axiosRateLimiter($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": this.$auth.api_key,
        },
        ...otherOpts,
      });
    },
    retrieveEvents({
      collectionSlug, ...opts
    }) {
      return this._makeRequest({
        path: `/events/collection/${collectionSlug}`,
        ...opts,
      });
    },
  },
};
