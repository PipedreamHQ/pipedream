import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chargekeep",
  propDefinitions: {
    contactId: {
      type: "integer",
      label: "Contact ID",
      description: "The ID of the contact",
      useQuery: true,
      async options({ query }) {
        const { result } = await this.listContacts({
          params: {
            SearchPhrase: query,
            TopCount: 50,
          },
        });
        return result.map(({
          id: value, personName, companyName,
        }) => ({
          value,
          label: `${personName || companyName || value}`,
        }));
      },
    },
    contactGroupId: {
      type: "string",
      label: "Contact Group ID",
      description: "The ID of the contact group",
      async options() {
        const { result } = await this.listContactGroups({});
        return result.map(({
          id: value, name,
        }) => ({
          value,
          label: name,
        }));
      },
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "The ID of the currency",
      async options() {
        const { result } = await this.listCurrencies();
        return result.map(({
          id: value, name,
        }) => ({
          value,
          label: name,
        }));
      },
    },
    productCodes: {
      type: "string[]",
      label: "Product Codes",
      description: "The codes of the products to add to the invoice",
      async options() {
        const { result } = await this.listProducts();
        return result.map(({
          code: value, name,
        }) => ({
          value,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://crm.chargekeep.com/api/services/CRM";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "api-key": `${this.$auth.api_key}`,
        },
      });
    },
    getContactInfo(opts = {}) {
      return this._makeRequest({
        path: "/Contact/GetContactInfo",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/Contact/GetSourceContacts",
        ...opts,
      });
    },
    listContactGroups(opts = {}) {
      return this._makeRequest({
        path: "/Contact/GetContactGroups",
        ...opts,
      });
    },
    listCurrencies(opts = {}) {
      return this._makeRequest({
        path: "/Currency/GetCurrencies",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/Product/GetProducts",
        ...opts,
      });
    },
    createOrUpdateContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Contact/CreateOrUpdateContact",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Invoice/Create",
        ...opts,
      });
    },
  },
};
