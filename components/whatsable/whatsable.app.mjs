import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whatsable",

  propDefinitions: {
    api_key: {
      type: "string",
      label: "API Key",
      description: "Your Whatsable API key",
      secret: true,
    },
  },

  methods: {
    _baseUrl() {
      return "https://api.whatsable.app/v1";
    },

    async _makeRequest({
      $,
      path = "",
      method = "GET",
      headers = {},
      ...opts
    } = {}) {
      return axios($, {
        ...opts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },

    async testConnection($) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/me",
      });
    },

    async sendMessage(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "/messages",
      });
    },

    async listMessages(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "/messages",
      });
    },

    async getMessage(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: `/messages/${args.id}`,
      });
    },

    async listTemplates(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "/templates",
      });
    },

    async listContacts(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "/contacts",
      });
    },

    async createContact(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "/contacts",
      });
    },

    async listNumbers(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "/numbers",
      });
    },

    async listConversations(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "/conversations",
      });
    },
  },
};
