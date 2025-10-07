import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "accuranker",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.accuranker.com/api/v4";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listDomains(opts = {}) {
      return this._makeRequest({
        path: "/domains/",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: DEFAULT_LIMIT,
        },
      };

      let total, count = 0;
      do {
        const response = await fn(args);
        for (const item of response) {
          yield item;
          if (max && ++count >= max) {
            return count;
          }
        }
        total = response?.length;
        args.params.offset += DEFAULT_LIMIT;
      } while (total === DEFAULT_LIMIT);
    },
  },
};
