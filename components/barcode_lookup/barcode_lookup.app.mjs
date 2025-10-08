import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "barcode_lookup",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.barcodelookup.com/v3";
    },
    _params(params = {}) {
      return {
        ...params,
        key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, params, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    searchProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { products: data } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data?.length;

      } while (hasMore);
    },
  },
};
