import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ditlead",
  propDefinitions: {},
  methods: {
    _makeRequest({
      $, headers, ...args
    }) {
      return axios($, {
        baseURL: "https://api.ditlead.com/v1",
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    createWebhook(args) {
      return this._makeRequest({
        method: "POST",
        url: "/webhook",
        ...args,
      });
    },
    deleteWebhook(args) {
      return this._makeRequest({
        method: "DELETE",
        url: "/webhook",
        ...args,
      });
    },
    listCampaigns(args) {
      return this._makeRequest({
        url: "/campaign",
        ...args,
      });
    },
  },
};
