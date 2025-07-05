import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sage_accounting",
  propDefinitions: {
    contactTypeIds: {
      type: "string[]",
      label: "Contact Type IDs",
      description: "The IDs of the Contact Types",
      async options() {
        const contactTypes = await this.listContactTypes();
        return contactTypes.map((contactType) => ({
          label: contactType.displayed_as,
          value: contactType.id,
        }));
      },
      default: [
        "CUSTOMER",
      ],
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "The ID of the Currency",
      async options() {
        const currencies = await this.listCurrencies();
        return currencies.map((currency) => ({
          label: currency.displayed_as,
          value: currency.id,
        }));
      },
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.accounting.sage.com/v3.1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async listContactTypes(opts = {}) {
      const response = await this._makeRequest({
        path: "/contact_types",
        ...opts,
      });
      return response.$items || response.items || [];
    },
    async listCurrencies(opts = {}) {
      const response = await this._makeRequest({
        path: "/currencies",
        ...opts,
      });
      return response.$items || response.items || [];
    },
    async listContacts(opts = {}) {
      const response = await this._makeRequest({
        path: "/contacts",
        ...opts,
      });
      return response.$items || response.items || [];
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    async getContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    async updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    async deleteContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
  },
};
