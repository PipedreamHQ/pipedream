import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scalr",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account you wish to use.",
      async options() {
        const { data: accounts } = await this.getAccounts();
        return accounts.map((account) => ({
          label: account.attributes.name,
          value: account.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.scalr.io/api/iacp/v3`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-type": "application/vnd.api+json",
          ...headers,
        },
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/integrations/webhooks",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        path: `/integrations/webhooks/${webhookId}`,
        method: "delete",
      });
    },
    async getWebhooks(args = {}) {
      return this._makeRequest({
        path: "/integrations/webhooks",
        ...args,
      });
    },
    async getAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    async getEvents(args = {}) {
      return this._makeRequest({
        path: "/event-definitions",
        ...args,
      });
    },
  },
};
