import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_bigin",
  propDefinitions: {
    contactId: {
      label: "Contact ID",
      description: "The contact ID",
      type: "string",
      async options({ page }) {
        const { data: contacts } = await this.getContacts({
          params: {
            page: page + 1,
          },
        });

        return contacts.map((contact) => ({
          label: contact.Email,
          value: contact.id,
        }));
      },
    },
  },
  methods: {
    _apiDomain() {
      return this.$auth.api_domain;
    },
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `${this._apiDomain()}/bigin/v1`;
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this._oauthAccessToken()}`,
        },
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/actions/watch",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(args = {}) {
      return this._makeRequest({
        path: "/actions/watch",
        method: "patch",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/Contacts",
        ...args,
      });
    },
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/Contacts/${contactId}`,
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/Contacts",
        method: "post",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/Contacts/${contactId}`,
        method: "put",
        ...args,
      });
    },
    async getCalls(args) {
      return this._makeRequest({
        path: "/Calls",
        ...args,
      });
    },
    async getCall({
      callId, ...args
    }) {
      return this._makeRequest({
        path: `/Calls/${callId}`,
        ...args,
      });
    },
    async createCall(args = {}) {
      return this._makeRequest({
        path: "/Calls",
        method: "post",
        ...args,
      });
    },
    async createEvent(args = {}) {
      return this._makeRequest({
        path: "/Events",
        method: "post",
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getDeals(args = {}) {
      return this._makeRequest({
        path: "/Deals",
        ...args,
      });
    },
    async getDeal({
      dealId, ...args
    }) {
      return this._makeRequest({
        path: `/Deals/${dealId}`,
        ...args,
      });
    },
  },
};
