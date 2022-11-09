import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vision6",
  propDefinitions: {
    list: {
      type: "integer",
      label: "List",
      description: "Filter contact by list",
      async options({ page }) {
        const limit = 10;
        const params = {
          limit,
          offset: limit * page,
        };
        const { _embedded: { lists } } = await this.listLists({
          params,
        });
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    contact: {
      type: "integer",
      label: "Contact",
      description: "Select the contact to update",
      async options({
        page, listId, params = {},
      }) {
        const limit = 10;
        params = {
          ...params,
          limit,
          offset: limit * page,
        };
        const { _embedded: { contacts } } = await this.listContacts(listId, {
          params,
        });
        return contacts.map((contact) => ({
          label: contact.email || contact.id,
          value: contact.id,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile phone number of the contact",
      optional: true,
    },
    emailSubscribed: {
      type: "boolean",
      label: "Email Subscribed",
      description: "True if the contact's email is subscribed",
      optional: true,
    },
    mobileSubscribed: {
      type: "boolean",
      label: "Mobile Subscribed",
      description: "True is the contact's mobile phone number is subscribed",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Active",
      description: "The active status of the contact",
      optional: true,
    },
    doubleOptIn: {
      type: "boolean",
      label: "Double Opt-In",
      description: "If set to true then double_opt_in_time will be updated to the current time",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.region}.api.vision6.com`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest(args) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    daysAgo(days) {
      return new Date().setDate(new Date().getDate() - days);
    },
    async listLists(args = {}) {
      return this._makeRequest({
        path: "/v1/lists",
        ...args,
      });
    },
    async listContacts(listId, args = {}) {
      return this._makeRequest({
        path: `/v1/lists/${listId}/contacts`,
        ...args,
      });
    },
    async createContact(listId, args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/lists/${listId}/contacts`,
        ...args,
      });
    },
    async updateContact(listId, args = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/v1/lists/${listId}/contacts`,
        ...args,
      });
    },
    async deleteContact(listId, contactId, args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/v1/lists/${listId}/contacts/${contactId}`,
        ...args,
      });
    },
  },
};
