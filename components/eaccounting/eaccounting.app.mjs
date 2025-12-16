import { axios } from "@pipedream/platform";
import { BASE_URL } from "./common/constants.mjs";

export default {
  type: "app",
  app: "eaccounting",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The customer ID",
      async options() {
        const { data } = await this.listCustomers();
        return data.map((customer) => ({
          label: customer.name || customer.customerNumber,
          value: customer.id,
        }));
      },
    },
    supplierId: {
      type: "string",
      label: "Supplier ID",
      description: "The supplier ID",
      async options() {
        const { data } = await this.listSuppliers();
        return data.map((supplier) => ({
          label: supplier.name || supplier.supplierNumber,
          value: supplier.id,
        }));
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The article ID",
      async options() {
        const { data } = await this.listArticles();
        return data.map((article) => ({
          label: article.name || article.articleNumber,
          value: article.id,
        }));
      },
    },
    bankAccountId: {
      type: "string",
      label: "Bank Account ID",
      description: "The bank account ID",
      async options() {
        const { data } = await this.getBankAccounts();
        return data.map((account) => ({
          label: account.name || account.accountNumber,
          value: account.id,
        }));
      },
    },
    fiscalYearId: {
      type: "string",
      label: "Fiscal Year ID",
      description: "The fiscal year ID",
      async options() {
        const { data } = await this.listFiscalYears();
        return data.map((year) => ({
          label: `${year.startDate} - ${year.endDate}`,
          value: year.id,
        }));
      },
    },
  },
  methods: {
    _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${BASE_URL}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
          ...headers,
        },
        ...opts,
      });
    },
    // Account Balances
    getAccountBalances({
      date, ...opts
    }) {
      return this._makeRequest({
        path: `/accountbalances/${date}`,
        ...opts,
      });
    },
    getAccountBalanceByAccountNumber({
      accountNumber, date, ...opts
    }) {
      return this._makeRequest({
        path: `/accountbalances/${accountNumber}/${date}`,
        ...opts,
      });
    },
    // Articles
    listArticles(opts = {}) {
      return this._makeRequest({
        path: "/articles",
        ...opts,
      });
    },
    // Attachments
    getAttachments(opts = {}) {
      return this._makeRequest({
        path: "/attachments",
        ...opts,
      });
    },
    createAttachment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/attachments",
        ...opts,
      });
    },
    // Bank Accounts
    getBankAccounts(opts = {}) {
      return this._makeRequest({
        path: "/bankaccounts",
        ...opts,
      });
    },
    // Bank Transactions
    getUnmatchedBankTransactions({
      bankAccountId, ...opts
    }) {
      return this._makeRequest({
        path: `/banktransactions/${bankAccountId}/unmatched`,
        ...opts,
      });
    },
    // Company Settings
    getCompanySettings(opts = {}) {
      return this._makeRequest({
        path: "/companysettings",
        ...opts,
      });
    },
    // Customers
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    // Customer Invoices
    getCustomerInvoices(opts = {}) {
      return this._makeRequest({
        path: "/customerinvoices",
        ...opts,
      });
    },
    createCustomerInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customerinvoices",
        ...opts,
      });
    },
    // Fiscal Years
    listFiscalYears(opts = {}) {
      return this._makeRequest({
        path: "/fiscalyears",
        ...opts,
      });
    },
    listFiscalYearsOpeningBalances(opts = {}) {
      return this._makeRequest({
        path: "/fiscalyearsopeningbalances",
        ...opts,
      });
    },
    // Suppliers
    listSuppliers(opts = {}) {
      return this._makeRequest({
        path: "/suppliers",
        ...opts,
      });
    },
    // Supplier Invoices
    getSupplierInvoices(opts = {}) {
      return this._makeRequest({
        path: "/supplierinvoices",
        ...opts,
      });
    },
    createSupplierInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/supplierinvoices",
        ...opts,
      });
    },
    // Vouchers
    listVouchers(opts = {}) {
      return this._makeRequest({
        path: "/vouchers",
        ...opts,
      });
    },
    createVoucher(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/vouchers",
        ...opts,
      });
    },
  },
};
