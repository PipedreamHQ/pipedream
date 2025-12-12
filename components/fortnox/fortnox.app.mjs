import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fortnox",
  propDefinitions: {
    customerNumber: {
      type: "string",
      label: "Customer Number",
      description: "The number of the customer",
      async options({ page }) {
        const { Customers: customers } = await this.listCustomers({
          params: {
            page: page + 1,
            sortby: "customernumber",
            sortorder: "descending",
          },
        });
        return customers?.map(({
          CustomerNumber: value, Name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    articleNumber: {
      type: "string",
      label: "Article Number",
      description: "The number of the article",
      async options({ page }) {
        const { Articles: articles } = await this.listArticles({
          params: {
            page: page + 1,
            sortby: "articlenumber",
            sortorder: "descending",
          },
        });
        return articles?.map(({
          ArticleNumber: value, Description: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The number of the invoice",
      async options({ page }) {
        const { Invoices: invoices } = await this.listInvoices({
          params: {
            page: page + 1,
            sortby: "documentnumber",
            sortorder: "descending",
          },
        });
        return invoices?.map(({
          DocumentNumber: value, DocumentNumber: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    supplierNumber: {
      type: "string",
      label: "Supplier Number",
      description: "The number of the supplier",
      optional: true,
      async options({ page }) {
        const { Suppliers: suppliers } = await this.listSuppliers({
          params: {
            page: page + 1,
            sortby: "suppliernumber",
            sortorder: "descending",
          },
        });
        return suppliers?.map(({
          SupplierNumber: value, Name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    voucherNumber: {
      type: "string",
      label: "Voucher Number",
      description: "The number of the voucher",
      optional: true,
      async options({ page }) {
        const { Vouchers: vouchers } = await this.listVouchers({
          params: {
            page: page + 1,
            sortby: "vouchernumber",
            sortorder: "descending",
          },
        });
        return vouchers?.map(({
          VoucherNumber: value, Description: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    supplierInvoiceNumber: {
      type: "string",
      label: "Supplier Invoice Number",
      description: "The number of the supplier invoice",
      async options() {
        const { SupplierInvoices: supplierInvoices } = await this.listSupplierInvoices();
        return supplierInvoices?.map((invoice) => ({
          label: `${invoice.InvoiceNumber} - ${invoice.Total}`,
          value: invoice.GivenNumber,
        })) || [];
      },
    },
    articleDescription: {
      type: "string",
      label: "Description",
      description: "The description of the article",
    },
    ean: {
      type: "string",
      label: "EAN",
      description: "The EAN of the article",
      optional: true,
    },
    directCost: {
      type: "string",
      label: "Direct Cost",
      description: "The direct cost of the article",
      optional: true,
    },
    freightCost: {
      type: "string",
      label: "Freight Cost",
      description: "The freight cost of the article",
      optional: true,
    },
    purchasePrice: {
      type: "string",
      label: "Purchase Price",
      description: "The purchase price of the article",
      optional: true,
    },
    salesPrice: {
      type: "string",
      label: "Sales Price",
      description: "The sales price of the article",
      optional: true,
    },
    manufacturer: {
      type: "string",
      label: "Manufacturer",
      description: "The manufacturer of the article",
      optional: true,
    },
    quantityInStock: {
      type: "string",
      label: "Quantity in Stock",
      description: "The quantity in stock of the article",
      optional: true,
    },
    articleType: {
      type: "string",
      label: "Type",
      description: "The type of the article",
      options: [
        "STOCK",
        "SERVICE",
      ],
      optional: true,
    },
    articleVat: {
      type: "string",
      label: "VAT",
      description: "The VAT of the article",
      optional: true,
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "The weight of the article",
      optional: true,
    },
    width: {
      type: "string",
      label: "Width",
      description: "The width of the article",
      optional: true,
    },
    height: {
      type: "string",
      label: "Height",
      description: "The height of the article",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the customer",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The first line of the address",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The second line of the address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the address",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the address",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the address",
      optional: true,
    },
    customerType: {
      type: "string",
      label: "Customer Type",
      description: "The type of the customer",
      options: [
        "PRIVATE",
        "COMPANY",
      ],
      optional: true,
    },
    customerVat: {
      type: "string",
      label: "VAT",
      description: "The VAT number of the customer",
      optional: true,
    },
    vatType: {
      type: "string",
      label: "VAT Type",
      description: "The VAT type of the customer",
      options: [
        "SEVAT",
        "SEREVERSEDVAT",
        "EUREVERSEDVAT",
        "EUVAT",
        "EXPORT",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fortnox.se/3";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        ...opts,
      });
    },
    getArticle({
      articleNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/articles/${articleNumber}`,
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
    listArticles(opts = {}) {
      return this._makeRequest({
        path: "/articles",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    listSuppliers(opts = {}) {
      return this._makeRequest({
        path: "/suppliers",
        ...opts,
      });
    },
    listVouchers(opts = {}) {
      return this._makeRequest({
        path: "/vouchers",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    createArticle(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/articles",
        ...opts,
      });
    },
    createInvoicePayment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoicepayments",
        ...opts,
      });
    },
    sendInvoice({
      invoiceNumber, type, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${invoiceNumber}/${type}`,
        ...opts,
      });
    },
    updateArticle({
      articleNumber, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/articles/${articleNumber}`,
        ...opts,
      });
    },
    updateCustomer({
      customerNumber, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${customerNumber}`,
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listFinancialYears(opts = {}) {
      return this._makeRequest({
        path: "/financialyears",
        ...opts,
      });
    },
    listSupplierInvoices(opts = {}) {
      return this._makeRequest({
        path: "/supplierinvoices",
        ...opts,
      });
    },
    getSupplierInvoice({
      supplierInvoiceNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/supplierinvoices/${supplierInvoiceNumber}`,
        ...opts,
      });
    },
  },
};
