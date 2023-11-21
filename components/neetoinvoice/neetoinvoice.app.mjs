import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "neetoinvoice",
  propDefinitions: {
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of items to be returned per page.",
      default: 5,
      min: 1,
    },
    pageIndex: {
      type: "integer",
      label: "Page Index",
      description: "The page number to be returned.",
      default: 1,
      min: 1,
    },
    subscriptionUrl: {
      type: "string",
      label: "Subscription URL",
      description: "URL to which events are to be sent.",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of event to subscribe to.",
      options: [
        {
          label: "New Client",
          value: "new_client",
        },
        {
          label: "New Invoice",
          value: "new_invoice",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://neetoinvoice.com";
    },
    _headers() {
      return {
        Authorization: `Basic ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, method, path, headers, data, params,
    }) {
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: headers
          ? {
            ...this._headers(),
            ...headers,
          }
          : this._headers(),
        data,
        params,
      });
    },
    async subscribe({
      url, event,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/neeto_integrations/zapier/subscriptions",
        data: {
          zapier_subscription: {
            options: {
              url,
              event,
            },
            subscription_for: "Zapier",
          },
        },
      });
    },
    async unsubscribe(apiKey) {
      return this._makeRequest({
        method: "DELETE",
        path: `/neeto_integrations/zapier/subscriptions/${apiKey}`,
      });
    },
    async getClients({
      pageSize, pageIndex,
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/neeto_integrations/zapier/clients",
        params: {
          page_size: pageSize,
          page_index: pageIndex,
        },
      });
    },
    async getInvoices({
      pageSize, pageIndex,
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/neeto_integrations/zapier/invoices",
        params: {
          page_size: pageSize,
          page_index: pageIndex,
        },
      });
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
