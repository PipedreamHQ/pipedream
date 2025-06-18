import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tettra",
  methods: {
    async _makeRequest({
      $ = this,
      data,
      ...args
    }) {
      const response = await axios($, {
        baseURL: `https://app.tettra.co/api/teams/${this.$auth.team_id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ...data,
          api_key: this.$auth.api_key,
        },
        ...args,
      });
      return response;
    },
    async createPage(args) {
      return this._makeRequest({
        url: "/pages",
        method: "POST",
        ...args,
      });
    },
    async suggestPage(args) {
      return this._makeRequest({
        url: "/suggestions",
        method: "POST",
        ...args,
      });
    },
  },
};
