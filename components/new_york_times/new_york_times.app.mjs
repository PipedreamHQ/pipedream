import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "new_york_times",
  methods: {
    _baseUrl() {
      return "https://api.nytimes.com/svc";
    },
    _params(params = {}) {
      return {
        ...params,
        "api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, params, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: this._params(params),
      });
    },
    searchArticles(opts = {}) {
      return this._makeRequest({
        path: "/search/v2/articlesearch.json",
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
        params.page = page++;
        const { response: { docs } } = await fn({
          params,
          ...opts,
        });
        for (const d of docs) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = docs.length;

      } while (hasMore);
    },
  },
};
