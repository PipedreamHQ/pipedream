import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "quipu",
  propDefinitions: {
    client: {
      type: "string",
      label: "Client",
      description: "Select a client.",
      async options() {
        return this.getContactsOpts();
      },
    },
    accountingCategory: {
      type: "string",
      label: "Accounting Category",
      description: "Select an accounting category.",
      async options() {
        return this.getAccountingCategoriesOpts("income");
      },
    },
    number: {
      type: "string",
      label: "Number",
      description: "The invoice number.",
    },
    issued: {
      type: "string",
      label: "Issued",
      description: "The issue date of the invoice, ISO 8601 format. Example: `2019-07-26`.",
    },
    paidAt: {
      type: "string",
      label: "Paid At",
      description: "Date of payment, ISO 8601 format. Example: `2019-07-26`.",
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The method of payment.",
      options: constants.PAYMENT_METHOD_OPTS,
    },
    items: {
      type: "string",
      label: "Items",
      description: "An array of objects as the following example:\n `[{\"type\": \"book_entry_items\", \"attributes\": {\"concept\": \"Screws\", \"unitary_amount\": \"0.50\", \"quantity\":30, \"vat_percent\":21, \"retention_percent\":0}}, {\"type\": \"book_entry_items\", \"attributes\": {\"concept\": \"Nuts\", \"unitary_amount\": \"0.35\", \"quantity\":30, \"vat_percent\":21, \"retention_percent\":0}}]`\n [see docs here](http://quipuapp.github.io/api-v1-docs/#items).",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Add tags to the invoice.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://getquipu.com";
    },
    _accessToken() {
      return `Bearer ${this.$auth.oauth_access_token}`;
    },
    _getHeaders() {
      return {
        "accept": "application/vnd.quipu.v1+json",
        "content-type": "application/vnd.quipu.v1+json",
        "Authorization": this._accessToken(),
      };
    },
    _getRequestParams(opts = {}) {
      try {
        return {
          ...opts,
          url: this._getBaseUrl() + opts.path,
          headers: this._getHeaders(),
        };
      } catch (ex) {
        console.log(ex?.response?.data?.errors);
        throw ex;
      }
    },
    async getContactsOpts() {
      const response = await axios(this, this._getRequestParams({
        method: "GET",
        path: "/contacts",
      }));
      return response.data.map((client) => ({
        label: client.attributes.name,
        value: client.id,
      }));
    },
    async getAccountingCategoriesOpts(kind) {
      const response = await axios(this, this._getRequestParams({
        method: "GET",
        path: "/accounting_categories",
        params: {
          "filter[kind]": kind,
        },
      }));
      return response.data.map((client) => ({
        label: client.attributes.name,
        value: client.id,
      }));
    },
    async createContact(ctx = this, attributes) {
      const data = {
        data: {
          type: "contacts",
          attributes,
        },
      };
      const response = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/contacts",
        data,
      }));
      return response.data;
    },
    async createTicket(ctx = this, attributes) {
      const data = {
        data: {
          type: "tickets",
          attributes,
        },
      };
      const response = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/tickets",
        data,
      }));
      return response.data;
    },
    async createInvoice(ctx = this, attributes, relationships) {
      const data = {
        data: {
          type: "invoices",
          attributes,
          relationships,
        },
      };
      const response = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/invoices",
        data,
      }));
      return response.data;
    },
  },
};
