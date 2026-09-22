import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "simplybook_me",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://user-api-v2.simplybook.me";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-Token": this.$auth.oauth_access_token,
          "X-Company-Login": this.$auth.company,
        },
        ...opts,
      });
    },
    listBookings(opts = {}) {
      return this._makeRequest({
        path: "/admin/bookings/",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
      max,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let count = 0, hasMore = true;
      do {
        const {
          data, metadata,
        } = await resourceFn({
          params,
        });
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = metadata.pages_count > params.page;
        params.page++;
      } while (hasMore);
    },
  },
};
