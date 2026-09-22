import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sperse",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options() {
        const { result } = await this.getContacts({
          params: {
            TopCount: constants.DEFAULT_LIMIT,
          },
        });
        return result?.map(({
          id: value, name, email,
        }) => ({
          label: `${name} ${email
            ? `(${email})`
            : ""}`.trim(),
          value,
        })) || [];
      },
    },
    contactGroupId: {
      type: "string",
      label: "Contact Group ID",
      description: "The ID of the contact group",
      async options() {
        const { result } = await this.getContactGroups();
        return result?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "The ID of the currency",
      async options() {
        const { result } = await this.getCurrencies();
        return result?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    productId: {
      type: "integer",
      label: "Product ID",
      description: "The ID of the product",
      async options({ page }) {
        const { result } = await this.getProducts({
          params: {
            phrase: "",
            MaxResultCount: 20,
            SkipCount: page * 20,
          },
        });
        return result?.items?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://app.sperse.com${path}`;
    },
    getHeaders(headers) {
      return {
        "api-key": this.$auth.api_key,
        "accept": "application/json",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      try {
        return await axios($, {
          url: this.getUrl(path),
          headers: this.getHeaders(headers),
          ...opts,
        });

      } catch (error) {
        throw new Error(JSON.stringify(error.response.data, null, 2));
      }
    },
    async createOrUpdateContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/services/CRM/Contact/CreateOrUpdateContact",
        ...opts,
      });
    },
    async getContactDetails(opts = {}) {
      return this._makeRequest({
        path: "/api/services/CRM/Contact/GetContactDetails",
        ...opts,
      });
    },
    async getContacts(opts = {}) {
      return this._makeRequest({
        path: "/api/services/CRM/Contact/GetAllByPhrase",
        ...opts,
      });
    },
    async getContactGroups(opts = {}) {
      return this._makeRequest({
        path: "/api/services/CRM/Contact/GetContactGroups",
        ...opts,
      });
    },
    async createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/services/CRM/Lead/Create",
        ...opts,
      });
    },
    async getLeads(opts = {}) {
      return this._makeRequest({
        path: "/api/services/CRM/Lead/GetAllByPhrase",
        ...opts,
      });
    },
    async createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/services/CRM/Invoice/Create",
        ...opts,
      });
    },
    async createProduct(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/services/CRM/Product/CreateProduct",
        ...opts,
      });
    },
    async getProducts(opts = {}) {
      return this._makeRequest({
        path: "/api/services/CRM/Product/GetProductsByPhrase",
        ...opts,
      });
    },
    async getSubscriptionHistory(opts = {}) {
      return this._makeRequest({
        path: "/api/services/CRM/OrderSubscription/GetSubscriptionHistory",
        ...opts,
      });
    },
    async getCurrencies(opts = {}) {
      return this._makeRequest({
        path: "/api/services/CRM/Currency/GetCurrencies",
        ...opts,
      });
    },
  },
};
