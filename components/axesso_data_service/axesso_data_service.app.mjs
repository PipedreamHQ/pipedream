import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 6000, // 10 requests per minute (1 request every 6000ms)
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

export default {
  type: "app",
  app: "axesso_data_service",
  propDefinitions: {
    url: {
      type: "string",
      label: "Product URL",
      description: "The URL of the Amazon product to lookup",
    },
    domainCode: {
      type: "string",
      label: "Domain Code",
      description: "The amazon marketplace domain code",
      options: constants.DOMAIN_CODES,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The sort option for the search or reviews",
      options: constants.SORT_OPTIONS,
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Defaults to `25`",
      default: 25,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.axesso.de/amz";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axiosRateLimiter($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "axesso-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    getProductDetails(opts = {}) {
      return this._makeRequest({
        path: "/amazon-lookup-product",
        ...opts,
      });
    },
    searchProducts(opts = {}) {
      return this._makeRequest({
        path: "/amazon-search-by-keyword-asin",
        ...opts,
      });
    },
    lookupReviews(opts = {}) {
      return this._makeRequest({
        path: "/amazon-lookup-reviews",
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
        },
      };
      let hasMore = true;
      let count = 0;
      while (hasMore) {
        const response = await fn(args);
        const items = response[resourceKey];
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        if (!items?.length) {
          hasMore = false;
        }
        args.params.page++;
      }
    },
  },
};
