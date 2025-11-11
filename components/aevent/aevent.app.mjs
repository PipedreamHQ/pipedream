import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aevent",
  methods: {
    _apiUrl() {
      return "https://app.aevent.com/api";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listRegistrants(args = {}) {
      return this._makeRequest({
        path: "registrants",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = page++;
        const { success: data } = await fn({
          params,
        });

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
