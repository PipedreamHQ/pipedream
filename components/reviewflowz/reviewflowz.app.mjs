import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reviewflowz",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The account ID associated with your listings.",
      async options() {
        const { accounts } = await this.getMe();

        return accounts.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.reviewflowz.com/api/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      };

      return axios($, config);
    },
    getMe() {
      return this._makeRequest({
        path: "/me",
      });
    },
    listReviews({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/reviews`,
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
        const {
          data,
          pagination: { next },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }
        hasMore = next;

      } while (hasMore);
    },
  },
};
