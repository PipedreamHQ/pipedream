import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshbooks",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The FreshBooks account ID (accounting system id).",
      async options() {
        const { response: { business_memberships: items } } = await this.getMe();

        return items.map(({
          business: {
            account_id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice",
      async options({ accountId }) {
        const { response: { result: { invoices } } } = await this.listInvoices({
          accountId,
        });
        return invoices.map(({
          id: value, fname, lname, amount, currency_code: code,
        }) => ({
          label: `${fname
            ? `${fname} `
            : ""}${lname
            ? `${lname} `
            : ""}- ${code} ${amount.amount}`,
          value,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The client (customer) ID to invoice",
      async options({
        accountId, page,
      }) {
        const { response: { result: { clients } } } = await this.listClients({
          accountId,
          params: {
            page,
          },
        });
        return clients.map(({
          id: value, fname, lname, email,
        }) => ({
          label: `${fname} ${lname} - (${email || value})`,
          value,
        }));
      },
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "User-specified and visible invoice id",
      optional: true,
    },
    createDate: {
      type: "string",
      label: "Create Date",
      description: "Invoice date (YYYY-MM-DD). Defaults to today if not set",
      optional: true,
    },
    generationDate: {
      type: "string",
      label: "Generation Date",
      description: "Date invoice generated from object, null if it wasn't, YYYY-MM-DD (string) if it was",
      optional: true,
    },
    discountValue: {
      type: "string",
      label: "Discount Value (%)",
      description: "Discount percentage (0-100) applied to the subtotal",
      optional: true,
    },
    discountDescription: {
      type: "string",
      label: "Discount Description",
      description: "Public note about the discount",
      optional: true,
    },
    poNumber: {
      type: "string",
      label: "PO Number",
      description: "Reference number for address on invoice",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "Three-letter currency code (e.g. USD, CAD)",
      default: "USD",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Two-letter language code (e.g. en, fr)",
      default: "en",
      optional: true,
    },
    terms: {
      type: "string",
      label: "Terms",
      description: "Terms listed on the invoice",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes displayed on the invoice",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "First line of address on invoice",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street for address on invoice",
      optional: true,
    },
    street2: {
      type: "string",
      label: "Street 2",
      description: "Second line of street for address on invoice",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City for address on invoice",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province",
      description: "Province for address on invoice",
      optional: true,
    },
    code: {
      type: "string",
      label: "Code",
      description: "Zip code for address on invoice",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country for address on invoice",
      optional: true,
    },
    dueOffsetDays: {
      type: "integer",
      label: "Due Offset Days",
      description: "Number of days from creation that invoice is due. If not set, the due date will default to the date of issue",
      optional: true,
    },
    lines: {
      type: "string[]",
      label: "Line Items",
      description: "A list of line items. Example: `[{\"lineId\":1,\"amount\":\"10.50\",\"code\":\"USD\", \"updated\":\"2020-01-01 12:00:00\" }]` [See the documentation](https://www.freshbooks.com/api/invoices#:~:text=collection%20for%20details.-,Invoice%20Lines,-Invoice%20lines%20are)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.freshbooks.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth?.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    getMe() {
      return this._makeRequest({
        path: "/auth/api/v1/users/me",
      });
    },
    listClients({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounting/account/${accountId}/users/clients`,
        ...opts,
      });
    },
    createInvoice({
      accountId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/accounting/account/${accountId}/invoices/invoices`,
        ...opts,
      });
    },
    listInvoices({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounting/account/${accountId}/invoices/invoices`,
        ...opts,
      });
    },
    updateInvoice({
      accountId, invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/accounting/account/${accountId}/invoices/invoices/${invoiceId}`,
        ...opts,
      });
    },
    sendInvoiceByEmail({
      accountId, invoiceId, data, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/accounting/account/${accountId}/invoices/invoices/${invoiceId}`,
        data: {
          invoice: {
            action_email: true,
            ...data,
          },
        },
        ...opts,
      });
    },
    createHook({
      accountId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/events/account/${accountId}/events/callbacks`,
        ...opts,
      });
    },
    deleteHook({
      accountId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/events/account/${accountId}/events/callbacks/${webhookId}`,
      });
    },
    verifyCallback({
      accountId, callbackId, data,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/events/account/${accountId}/events/callbacks/${callbackId}`,
        data,
      });
    },
  },
};
