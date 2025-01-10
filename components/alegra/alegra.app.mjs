import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "alegra",
  propDefinitions: {
    seller: {
      type: "string",
      label: "Seller",
      description: "Seller associated with the contact",
      async options({ page }) {
        const data = await this.getSellers({
          params: {
            start: LIMIT * page,
            limit: LIMIT,
            status: "active",
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
    priceList: {
      type: "string",
      label: "Price List",
      description: "Price list associated with the contact",
      async options({ page }) {
        const data = await this.getPriceLists({
          params: {
            start: LIMIT * page,
            limit: LIMIT,
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
    term: {
      type: "string",
      label: "Term",
      description: "Payment terms associated with the contact",
      async options({ page }) {
        const data = await this.getTerms({
          params: {
            start: LIMIT * page,
            limit: LIMIT,
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
    debtToPay: {
      type: "integer",
      label: "Debt to Pay",
      description: "The Id of the debt to pay for the contact",
      async options({ page }) {
        const data = await this.getAccountingAccounts({
          params: {
            start: LIMIT * page,
            limit: LIMIT,
          },
        });
        return data.map(({
          id, name: label,
        }) => ({
          label,
          value: parseInt(id),
        }));
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search query for contacting (email, phone, or name)",
    },
    client: {
      type: "integer",
      label: "Client",
      description: "Client associated with the invoice",
      async options({ page }) {
        const data = await this.searchContact({
          params: {
            start: LIMIT * page,
            limit: LIMIT,
            type: "client",
          },
        });

        return data.map(({
          id, name: label,
        }) => ({
          label,
          value: parseInt(id),
        }));
      },
    },
    warehouse: {
      type: "string",
      label: "Warehouse",
      description: "Warehouse associated with the invoice",
      async options({ page }) {
        const data = await this.getWarehouses({
          params: {
            start: LIMIT * page,
            limit: LIMIT,
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
    costCenter: {
      type: "string",
      label: "Cost Center",
      description: "Cost center associated with the invoice",
      async options({ page }) {
        const data = await this.getCostCenters({
          params: {
            start: LIMIT * page,
            limit: LIMIT,
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
  },
  methods: {
    _baseUrl() {
      return "https://api.alegra.com/api/v1";
    },
    _auth() {
      return {
        username: this.$auth.user_email,
        password: this.$auth.access_token,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    generateInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        ...opts,
      });
    },
    searchContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    getSellers(opts = {}) {
      return this._makeRequest({
        path: "/sellers",
        ...opts,
      });
    },
    getPriceLists(opts = {}) {
      return this._makeRequest({
        path: "/price-lists",
        ...opts,
      });
    },
    getTerms(opts = {}) {
      return this._makeRequest({
        path: "/terms",
        ...opts,
      });
    },
    getAccountingAccounts(opts = {}) {
      return this._makeRequest({
        path: "/categories",
        ...opts,
      });
    },
    getWarehouses(opts = {}) {
      return this._makeRequest({
        path: "/warehouses",
        ...opts,
      });
    },
    getCostCenters(opts = {}) {
      return this._makeRequest({
        path: "/cost-centers",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/subscriptions",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/subscriptions/${webhookId}`,
      });
    },
  },
};
