import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "phoneburner",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact ID",
      async options() {
        const { contacts: { contacts } } = await this.getContacts();

        return contacts.map((contact) => ({
          label: contact.primary_email.email_address,
          value: contact.user_id,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "The last name of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
    },
  },
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://www.phoneburner.com/rest/1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          Authorization: `Bearer ${this._oauthAccessToken()}`,
        },
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "GET",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "GET",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
