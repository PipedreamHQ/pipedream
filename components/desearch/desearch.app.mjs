import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "desearch",
  methods: {
    async _makeRequest({ $ = this, ...args } = {}) {
      return axios($, {
        baseURL: "https://api.desearch.ai",
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    async webSearch(args = {}) {
      return this._makeRequest({
        method: "GET",
        url: "/web",
        ...args,
      });
    },
  },
};
