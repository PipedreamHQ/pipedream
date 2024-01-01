import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nimble",
  propDefinitions: {
    contactId: {
      label: "Contact ID",
      description: "The contact ID",
      type: "string",
      async options({ page }) {
        const { resources } = await this.getContacts({
          params: {
            meta: {
              page: page + 1,
            },
          },
        });

        return resources.filter((contact) => contact.record_type === "person").map((contact) => ({
          label: contact?.fields["first name"]?.[0]?.value
            || contact?.fields["last name"]?.[0]?.value
            || "",
          value: contact.id,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
    },
    phone: {
      type: "string",
      label: "Phone number",
      description: "Phone number of the contact",
    },
  },
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.nimble.com/api/v1";
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
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contact",
        method: "post",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/contact/${contactId}`,
        method: "put",
        ...args,
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        path: "/activities/task",
        method: "post",
        ...args,
      });
    },
  },
};
