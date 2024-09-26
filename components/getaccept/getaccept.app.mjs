import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "getaccept",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document Id",
      description: "The id of the document.",
      async options({ page }) {
        const data = await this.listDocuments({
          params: {
            offset: page * 100,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "Use this to specify the sender user/owner by email to be used for the document.",
      async options() {
        const { users } = await this.listUsers();

        return users.map(({ email }) => email);
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.getaccept.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    createDocument(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "documents",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "subscriptions",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `subscriptions/${hookId}`,
      });
    },
    listDocuments(args = {}) {
      return this._makeRequest({
        path: "documents",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "users",
        ...args,
      });
    },
    sendReminder({
      documentId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `documents/${documentId}/reminders`,
        ...args,
      });
    },
  },
};
