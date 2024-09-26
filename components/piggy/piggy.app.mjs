import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "piggy",
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
          label: contact.email,
          value: contact.uuid,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.piggy.eu/api/v3/oauth";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async findOrCreateContact(args = {}) {
      return this._makeRequest({
        path: "/clients/contacts/find-or-create",
        ...args,
      });
    },
    async createContactAttribute(args = {}) {
      return this._makeRequest({
        path: "/clients/contact-attributes",
        method: "post",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/clients/contacts",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/clients/contacts/${contactId}`,
        method: "put",
        ...args,
      });
    },
  },
};
