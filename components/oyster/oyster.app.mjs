import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "oyster",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.oysterhr.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
    listTimeOffRequests(opts = {}) {
      return this._makeRequest({
        path: "/time_off/requests",
        ...opts,
      });
    },
    listEngagements(opts = {}) {
      return this._makeRequest({
        path: "/engagements",
        ...opts,
      });
    },
    listExpenses(opts = {}) {
      return this._makeRequest({
        path: "/expenses",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let done = false;
      do {
        const {
          data, meta,
        } = await resourceFn({
          params,
        });
        for (const item of data) {
          yield item;
        }
        if (params.page === meta.pages) {
          done = true;
        }
        params.page++;
      } while (!done);
    },
  },
};
