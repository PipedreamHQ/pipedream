import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alegra",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Create Contact
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact",
    },
    identification: {
      type: "string",
      label: "Identification",
      description: "Identification of the contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the contact",
      optional: true,
    },
    phonePrimary: {
      type: "string",
      label: "Primary Phone",
      description: "Primary phone number of the contact",
      optional: true,
    },
    phoneSecondary: {
      type: "string",
      label: "Secondary Phone",
      description: "Secondary phone number of the contact",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Mobile phone number of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the contact",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the contact",
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "Fax number of the contact",
      optional: true,
    },
    debtToPay: {
      type: "integer",
      label: "Debt to Pay",
      description: "Debt to pay for the contact",
      optional: true,
    },
    accountReceivable: {
      type: "integer",
      label: "Account Receivable",
      description: "Account receivable associated with the contact",
      optional: true,
    },
    internalContacts: {
      type: "string",
      label: "Internal Contacts",
      description: "Internal contacts related to the contact",
      optional: true,
    },
    ignoreRepeated: {
      type: "boolean",
      label: "Ignore Repeated",
      description: "Ignore repeated contacts",
      optional: true,
    },
    statementAttached: {
      type: "boolean",
      label: "Statement Attached",
      description: "Whether statement is attached",
      optional: true,
    },
    sellerContact: {
      type: "string",
      label: "Seller",
      description: "Seller associated with the contact",
      optional: true,
      async options() {
        const sellersResponse = await this.getSellers();
        return sellersResponse.items.map((seller) => ({
          label: seller.name,
          value: seller.id,
        }));
      },
    },
    priceListContact: {
      type: "string",
      label: "Price List",
      description: "Price list associated with the contact",
      optional: true,
      async options() {
        const priceListsResponse = await this.getPriceLists();
        return priceListsResponse.items.map((priceList) => ({
          label: priceList.name,
          value: priceList.id,
        }));
      },
    },
    termContact: {
      type: "string",
      label: "Term",
      description: "Payment terms associated with the contact",
      optional: true,
      async options() {
        const termsResponse = await this.getTerms();
        return termsResponse.items.map((term) => ({
          label: term.name,
          value: term.id,
        }));
      },
    },

    // Create Invoice
    items: {
      type: "string[]",
      label: "Items",
      description: "Array of items in JSON format",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the invoice (YYYY-MM-DD)",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date of the invoice (YYYY-MM-DD)",
    },
    client: {
      type: "string",
      label: "Client",
      description: "Client ID associated with the invoice",
    },
    statusInvoice: {
      type: "string",
      label: "Status",
      description: "Status of the invoice",
      optional: true,
    },
    numberTemplateId: {
      type: "string",
      label: "Number Template ID",
      description: "Number template ID for the invoice",
      optional: true,
    },
    numberTemplatePrefix: {
      type: "string",
      label: "Number Template Prefix",
      description: "Prefix for the number template",
      optional: true,
    },
    numberTemplateNumber: {
      type: "string",
      label: "Number Template Number",
      description: "Number part of the number template",
      optional: true,
    },
    payments: {
      type: "string[]",
      label: "Payments",
      description: "Array of payments in JSON format",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Estimate associated with the invoice",
      optional: true,
    },
    termsConditions: {
      type: "string",
      label: "Terms & Conditions",
      description: "Terms and conditions of the invoice",
      optional: true,
    },
    annotation: {
      type: "string",
      label: "Annotation",
      description: "Annotation for the invoice",
      optional: true,
    },
    observations: {
      type: "string",
      label: "Observations",
      description: "Observations for the invoice",
      optional: true,
    },
    sellerInvoice: {
      type: "string",
      label: "Seller",
      description: "Seller associated with the invoice",
      optional: true,
      async options() {
        const sellersResponse = await this.getSellers();
        return sellersResponse.items.map((seller) => ({
          label: seller.name,
          value: seller.id,
        }));
      },
    },
    priceListInvoice: {
      type: "string",
      label: "Price List",
      description: "Price list associated with the invoice",
      optional: true,
      async options() {
        const priceListsResponse = await this.getPriceLists();
        return priceListsResponse.items.map((priceList) => ({
          label: priceList.name,
          value: priceList.id,
        }));
      },
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency for the invoice",
      optional: true,
    },
    retentions: {
      type: "string[]",
      label: "Retentions",
      description: "Array of retentions in JSON format",
      optional: true,
    },
    warehouse: {
      type: "string",
      label: "Warehouse",
      description: "Warehouse associated with the invoice",
      optional: true,
    },
    remissions: {
      type: "string[]",
      label: "Remissions",
      description: "Array of remissions in JSON format",
      optional: true,
    },
    costCenter: {
      type: "string",
      label: "Cost Center",
      description: "Cost center associated with the invoice",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments for the invoice",
      optional: true,
    },
    periodicity: {
      type: "string",
      label: "Periodicity",
      description: "Periodicity of the invoice",
      optional: true,
    },

    // Search Contact
    query: {
      type: "string",
      label: "Query",
      description: "Search query for contacting (email, phone, or name)",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.alegra.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Basic ${Buffer.from(this.$auth.api_key + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          name: this.name,
          identification: this.identification,
          address: this.address,
          city: this.city,
          phonePrimary: this.phonePrimary,
          phoneSecondary: this.phoneSecondary,
          mobile: this.mobile,
          seller: this.sellerContact,
          priceList: this.priceListContact,
          term: this.termContact,
          email: this.email,
          type: this.type,
          status: this.status,
          fax: this.fax,
          debtToPay: this.debtToPay,
          accountReceivable: this.accountReceivable,
          internalContacts: this.internalContacts,
          ignoreRepeated: this.ignoreRepeated,
          statementAttached: this.statementAttached,
        },
        ...opts,
      });
    },
    async generateInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        data: {
          items: this.items.map((item) => JSON.parse(item)),
          dueDate: this.dueDate,
          date: this.date,
          client: this.client,
          status: this.statusInvoice,
          numberTemplateId: this.numberTemplateId,
          numberTemplatePrefix: this.numberTemplatePrefix,
          numberTemplateNumber: this.numberTemplateNumber,
          payments: this.payments
            ? this.payments.map((payment) => JSON.parse(payment))
            : undefined,
          estimate: this.estimate,
          termsConditions: this.termsConditions,
          annotation: this.annotation,
          observations: this.observations,
          seller: this.sellerInvoice,
          priceList: this.priceListInvoice,
          currency: this.currency,
          retentions: this.retentions
            ? this.retentions.map((retention) => JSON.parse(retention))
            : undefined,
          warehouse: this.warehouse,
          remissions: this.remissions
            ? this.remissions.map((remission) => JSON.parse(remission))
            : undefined,
          costCenter: this.costCenter,
          comments: this.comments,
          periodicity: this.periodicity,
        },
        ...opts,
      });
    },
    async searchContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        params: {
          query: this.query,
        },
        ...opts,
      });
    },
    async getSellers(opts = {}) {
      return this._makeRequest({
        path: "/sellers",
        ...opts,
      });
    },
    async getPriceLists(opts = {}) {
      return this._makeRequest({
        path: "/price-lists",
        ...opts,
      });
    },
    async getTerms(opts = {}) {
      return this._makeRequest({
        path: "/terms",
        ...opts,
      });
    },
    async createWebhookSubscription({
      event, url,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/subscriptions",
        data: {
          event,
          url,
        },
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      let page = 0;
      let more = true;
      while (more) {
        const response = await fn({
          ...opts,
          page,
        });
        if (!response || response.length === 0) {
          more = false;
        } else {
          results.push(...response);
          page += 1;
        }
      }
      return results;
    },
  },
};
