import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "e_conomic",
  propDefinitions: {
    customerNumber: {
      type: "integer",
      label: "Customer Number",
      description: "The unique identifier of a customer",
      async options({ page }) {
        const { collection } = await this.listCustomers({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          customerNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    journalNumber: {
      type: "integer",
      label: "Journal Number",
      description: "The unique identifier of a journal",
      async options({ page }) {
        const { collection } = await this.listJournals({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          journalNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    draftInvoiceNumber: {
      type: "integer",
      label: "Draft Invoice Number",
      description: "The unique identifier of a draft invoice",
      async options({ page }) {
        const { collection } = await this.listInvoices({
          type: "drafts",
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          draftInvoiceNumber, notes,
        }) => ({
          label: notes?.heading || `Order #${draftInvoiceNumber}`,
          value: draftInvoiceNumber,
        }));
      },
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The code of the currency",
      async options({ page }) {
        const { collection } = await this.listCurrencies({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          code: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customerGroupNumber: {
      type: "integer",
      label: "Customer Group Number",
      description: "The unique identifier of a customer group",
      async options({ page }) {
        const { collection } = await this.listCustomerGroups({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          customerGroupNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    paymentTermNumber: {
      type: "integer",
      label: "Payment Term Number",
      description: "The unique identifier of a payment term",
      async options({ page }) {
        const { collection } = await this.listPaymentTerms({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          paymentTermsNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    vatZoneNumber: {
      type: "integer",
      label: "VAT Zone Number",
      description: "The unique identifier of a VAT zone",
      async options({ page }) {
        const { collection } = await this.listVatZones({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          vatZoneNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    layoutNumber: {
      type: "integer",
      label: "Layout Number",
      description: "The unique identifier of a layout",
      async options({ page }) {
        const { collection } = await this.listLayouts({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          layoutNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productNumbers: {
      type: "integer[]",
      label: "Product Numbers",
      description: "The unique identifiers of the products to add to the invoice",
      async options({ page }) {
        const { collection } = await this.listProducts({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          productNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    supplierNumber: {
      type: "integer",
      label: "Supplier Number",
      description: "The unique identifier of a supplier",
      async options({ page }) {
        const { collection } = await this.listSuppliers({
          params: {
            skippages: page,
            pagesize: DEFAULT_LIMIT,
          },
        });
        return collection.map(({
          supplierNumber: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    ean: {
      type: "string",
      label: "EAN",
      description: "European Article Number. EAN is used for invoicing the Danish public sector.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "Mobile phone number of the customer",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the customer",
      optional: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Address for the customer including street and number",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the customer",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code of the customer",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the customer",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://restapi.e-conomic.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-AppSecretToken": `${this.$auth.app_secret_token}`,
          "X-AgreementGrantToken": `${this.$auth.agreement_grant_token}`,
        },
        ...opts,
      });
    },
    getCustomer({
      customerNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerNumber}`,
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listJournals(opts = {}) {
      return this._makeRequest({
        path: "/journals",
        ...opts,
      });
    },
    listInvoices({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${type}`,
        ...opts,
      });
    },
    listCurrencies(opts = {}) {
      return this._makeRequest({
        path: "/currencies",
        ...opts,
      });
    },
    listCustomerGroups(opts = {}) {
      return this._makeRequest({
        path: "/customer-groups",
        ...opts,
      });
    },
    listPaymentTerms(opts = {}) {
      return this._makeRequest({
        path: "/payment-terms",
        ...opts,
      });
    },
    listVatZones(opts = {}) {
      return this._makeRequest({
        path: "/vat-zones",
        ...opts,
      });
    },
    listLayouts(opts = {}) {
      return this._makeRequest({
        path: "/layouts",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    listSuppliers(opts = {}) {
      return this._makeRequest({
        path: "/suppliers",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "POST",
        ...opts,
      });
    },
    updateCustomer({
      customerNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerNumber}`,
        method: "PUT",
        ...opts,
      });
    },
    createDraftInvoice(opts = {}) {
      return this._makeRequest({
        path: "/invoices/drafts",
        method: "POST",
        ...opts,
      });
    },
    bookInvoice(opts = {}) {
      return this._makeRequest({
        path: "/invoices/booked",
        method: "POST",
        ...opts,
      });
    },
    createVoucher({
      journalNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/journals/${journalNumber}/vouchers`,
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          skippages: 0,
          pagesize: DEFAULT_LIMIT,
        },
      };
      let total, count = 0;
      do {
        const { collection } = await fn(args);
        total = collection?.length;
        if (!total) {
          return;
        }
        for (const item of collection) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.skippages++;
      } while (total === DEFAULT_LIMIT);
    },
    async getPaginatedResources(opts) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
