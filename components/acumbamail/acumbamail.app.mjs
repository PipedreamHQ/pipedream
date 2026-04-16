import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "acumbamail",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of a list",
      async options() {
        const lists = await this.getLists();
        const options = [];
        for (const [
          key,
          value,
        ] of Object.entries(lists)) {
          options.push({
            label: value.name,
            value: key,
          });
        }
        return options;
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://acumbamail.com/api/1";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          auth_token: `${this.$auth.auth_token}`,
        },
        ...opts,
      });
    },
    configureWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/configListWebhook/",
        ...opts,
      });
    },
    getLists(opts = {}) {
      return this._makeRequest({
        path: "/getLists/",
        ...opts,
      });
    },
    getFields(opts = {}) {
      return this._makeRequest({
        path: "/getFields/",
        ...opts,
      });
    },
    getCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/getCampaigns/",
        ...opts,
      });
    },
    addOrUpdateSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/addSubscriber/",
        ...opts,
      });
    },
    sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sendSMS/",
        ...opts,
      });
    },
  },
};
