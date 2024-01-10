import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "boxhero",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://rest.boxhero-app.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    getTeam() {
      return this._makeRequest({
        path: "/teams/linked",
      });
    },
    listBasicTransactions(opts = {}) {
      return this._makeRequest({
        path: "/txs",
        ...opts,
      });
    },
    listLocationTransactions(opts = {}) {
      return this._makeRequest({
        path: "/location-txs",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
      max,
    }) {
      let hasMore = false;
      let count = 0;
      do {
        const {
          items, cursor, has_more,
        } = await resourceFn({
          params,
        });
        for (const item of items) {
          yield item;
          count++;
          if (max && count === max) {
            return;
          }
        }
        hasMore = has_more;
        params.cursor = cursor;
      } while (hasMore);
    },
  },
};
