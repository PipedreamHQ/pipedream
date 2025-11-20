import { axios } from "@pipedream/platform";
const LIMIT = 100;

export default {
  type: "app",
  app: "popupsmart",
  methods: {
    _baseUrl() {
      return "https://app.popupsmart.com/api";
    },
    _headers(headers = {}) {
      return {
        "x-token": this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listLeads(args = {}) {
      return this._makeRequest({
        path: "leads",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.take = LIMIT;
        params.skip = LIMIT * page++;
        const { leads } = await fn({
          params,
          ...opts,
        });
        for (const d of leads) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = leads.length;

      } while (hasMore);
    },
  },
};
