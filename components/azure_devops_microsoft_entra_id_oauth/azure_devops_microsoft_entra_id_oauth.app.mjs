import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "azure_devops_microsoft_entra_id_oauth",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Event type to receive events for",
      async options() {
        const types = await this.listEventTypes();
        return types?.map((type) => type.id);
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://dev.azure.com/${this.$auth.organization}/_apis`;
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "content-type": "application/json",
        },
        params: {
          ...params,
          "api-version": "7.1",
        },
        ...opts,
      });
    },
    async listEventTypes(opts = {}) {
      const { value } = await this._makeRequest({
        path: "/hooks/publishers/tfs/eventtypes",
        ...opts,
      });
      return value;
    },
    createSubscription(opts = {}) {
      return  this._makeRequest({
        method: "POST",
        path: "/hooks/subscriptions",
        ...opts,
      });
    },
    deleteSubscription(subscriptionId, opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/subscriptions/${subscriptionId}`,
        ...opts,
      });
    },
  },
};
