import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postgrid",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ page }) {
        const limit = 20;
        const params = {
          limit,
          skip: page * limit,
        };
        const { data } = await this.listContacts({
          params,
        });
        return data?.map(({
          id: value, firstName, lastName, companyName,
        }) => ({
          value,
          label: firstName
            ? `${firstName} ${lastName}`
            : companyName,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.postgrid.com/print-mail/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.postgrid.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    createLetter(args = {}) {
      return this._makeRequest({
        path: "/letters",
        method: "POST",
        ...args,
      });
    },
    createPostcard(args = {}) {
      return this._makeRequest({
        path: "/postcards",
        method: "POST",
        ...args,
      });
    },
  },
};
