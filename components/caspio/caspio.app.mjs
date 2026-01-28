import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "caspio",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "The table to listen for events on",
      async options() {
        const { Result: tables } = await this.listTables();
        return tables?.map((table) => table) || [];
      },
    },
  },
  methods: {
    _domain() {
      return this.$auth.domain.endsWith("/")
        ? this.$auth.domain.slice(0, -1)
        : this.$auth.domain;
    },
    _baseUrl() {
      return `${this._domain()}/integrations/rest/v3`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listTables(opts = {}) {
      return this._makeRequest({
        path: "/tables",
        ...opts,
      });
    },
    listTableFields({
      table, ...opts
    }) {
      return this._makeRequest({
        path: `/tables/${table}/fields`,
        ...opts,
      });
    },
    createRecord({
      table, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tables/${table}/records`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/outgoingWebhooks",
        ...opts,
      });
    },
    createWebhookEvent({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/outgoingWebhooks/${webhookId}/events`,
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/outgoingWebhooks/${webhookId}`,
      });
    },
  },
};
