import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sinch",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID of an app",
      async options() {
        const { apps } = await this.listApps();
        return apps?.map(({
          id: value, display_name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of a contact",
      async options({ prevContext }) {
        const {
          contacts, next_page_token: next,
        } = await this.listContacts({
          params: {
            page_token: prevContext?.nextPageToken,
          },
        });
        return {
          options: contacts?.map(({
            id: value, display_name: label,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            nextPageToken: next,
          },
        };
      },
    },
  },
  methods: {
    _getBaseUrl(api) {
      if (api === "conversation") {
        return `https://${this.$auth.region}.conversation.api.sinch.com/v1`;
      }
      if (api === "fax") {
        return "https://fax.api.sinch.com/v3";
      }
    },
    _makeRequest({
      $ = this, path, api = "conversation", headers, ...opts
    }) {
      return axios($, {
        url: `${this._getBaseUrl(api)}/projects/${this.$auth.project_id}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        api: "conversation",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        api: "conversation",
        path: `/webhooks/${webhookId}`,
        ...opts,
      });
    },
    createService(opts = {}) {
      return this._makeRequest({
        method: "POST",
        api: "fax",
        path: "/services",
        ...opts,
      });
    },
    deleteService({
      serviceId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        api: "fax",
        path: `/services/${serviceId}`,
        ...opts,
      });
    },
    listApps(opts = {}) {
      return this._makeRequest({
        api: "conversation",
        path: "/apps",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        api: "conversation",
        path: "/contacts",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        api: "conversation",
        path: "/messages:send",
        ...opts,
      });
    },
    sendFax(opts = {}) {
      return this._makeRequest({
        method: "POST",
        api: "fax",
        path: "/faxes",
        ...opts,
      });
    },
  },
};
