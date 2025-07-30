import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stiply",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.stiply.nl/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          Accept: "application/json",
        },
        ...opts,
      });
    },
    listSignRequests(opts = {}) {
      return this._makeRequest({
        path: "/sign_requests",
        ...opts,
      });
    },
    sendSignRequest(opts = {}) {
      return this._makeRequest({
        path: "/sign_requests",
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        $page: 1,
        $page_size: 100,
      };
      let total, count = 0;
      do {
        const { data } = await fn({
          params,
        });
        total = data?.length;
        if (!total) {
          return;
        }
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        params["$page"]++;
      } while (total === params["$page_size"]);
    },
    async getPaginatedResults(opts = {}) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
