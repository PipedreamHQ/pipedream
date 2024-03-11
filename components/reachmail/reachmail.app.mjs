import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reachmail",
  propDefinitions: {
    listId: {
      type: "string[]",
      label: "List ID",
      description: "The list ID related to the new campaign.",
      async options() {
        const data = await this.listLists();

        return data.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://services.reachmail.net";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createWebhook({
      action, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/Webhooks/${action}`,
        ...opts,
      });
    },
    deleteWebhook(action) {
      return this._makeRequest({
        method: "DELETE",
        path: `/Webhooks/${action}`,
      });
    },
    updateWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/Webhooks/${hookId}`,
        ...opts,
      });
    },
    listLists() {
      return this._makeRequest({
        path: "/Lists",
      });
    },
    optOutRecipient({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/Lists/OptOut/${listId}`,
        ...opts,
      });
    },
  },
};
