import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "landbot",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer to message",
      async options({ page }) {
        const { customers } = await this.listCustomers({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return customers.map((customer) => ({
          label: customer.name,
          value: customer.id,
        }));
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel to create a webhook for",
      async options({ page }) {
        const { channels } = await this.listChannels({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return channels.map((channel) => ({
          label: channel.name,
          value: channel.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.landbot.io/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Token ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    createWebhook({
      channelId, ...opts
    }) {
      return this._makeRequest({
        path: `/channels/${channelId}/message_hooks/`,
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      channelId, webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/channels/${channelId}/message_hooks/${webhookId}/`,
        method: "DELETE",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers/",
        ...opts,
      });
    },
    listChannels(opts = {}) {
      return this._makeRequest({
        path: "/channels/",
        ...opts,
      });
    },
    sendTextMessage({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}/send_text/`,
        method: "POST",
        ...opts,
      });
    },
    sendImageMessage({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}/send_image/`,
        method: "POST",
        ...opts,
      });
    },
  },
};
