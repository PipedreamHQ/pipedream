import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cleverreach",
  methods: {
    async _makeRequest($ = this, opts) {
      const {
        method,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `https://rest.cleverreach.com/v3${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createSubscriber($, data) {
      return this._makeRequest($, {
        method: "POST",
        path: "/receivers",
        data,
      });
    },
    async updateSubscriber($, id, data) {
      return this._makeRequest($, {
        method: "PUT",
        path: `/receivers/${id}`,
        data,
      });
    },
  },
};
