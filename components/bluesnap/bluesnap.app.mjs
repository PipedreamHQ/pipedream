// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

const MIN_LIMIT = 1;
const MAX_LIMIT = 1000;
const PERIOD_OPTIONS = [
  "THIS_MONTH",
  "LAST_WEEK",
  "LAST_MONTH",
  "LAST_3_MONTHS",
  "LAST_6_MONTHS",
  "LAST_12_MONTHS",
  "CUSTOM",
];

export default {
  type: "app",
  app: "bluesnap",
  propDefinitions: {
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The numeric BlueSnap transaction ID (e.g. `1023190247`). Run **List Transactions** first to find valid IDs.",
    },
    vaultedShopperId: {
      type: "string",
      label: "Vaulted Shopper ID",
      description: "The numeric vaulted shopper ID (e.g. `20769005`). Obtain it from the **Create Vaulted Shopper** response or a transaction record.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount as a decimal string (e.g. `29.99`).",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code (e.g. `USD`).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of results to return (${MIN_LIMIT}-${MAX_LIMIT}).`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      optional: true,
    },
    period: {
      type: "string",
      label: "Period",
      description: "Reporting period covered by the report. Use `CUSTOM` together with From Date and To Date to report on an explicit range.",
      options: PERIOD_OPTIONS,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Shopper first name (e.g. `Jane`).",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Shopper last name (e.g. `Doe`).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Shopper email address (e.g. `jane.doe@example.com`).",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "ISO 3166 two-letter country code (e.g. `US`).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Shopper city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Shopper state/province code.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP",
      description: "Shopper ZIP/postal code.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Shopper phone number.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/services/2`;
    },
    async _makeRequest({
      $, method = "GET", path, params, data, ...args
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Accept": "application/json",
          "bluesnap-version": "3.0",
          ...(data && {
            "Content-Type": "application/json",
          }),
        },
        auth: {
          username: `${this.$auth.username}`,
          password: `${this.$auth.password}`,
        },
        params,
        data,
        ...args,
      });
    },
    async createTransaction(args) {
      return this._makeRequest({
        method: "POST",
        path: "/transactions",
        ...args,
      });
    },
    async getTransaction({
      transactionId, ...args
    }) {
      return this._makeRequest({
        path: `/transactions/${transactionId}`,
        ...args,
      });
    },
    async refundTransaction({
      transactionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/transactions/refund/${transactionId}`,
        ...args,
      });
    },
    async listTransactions(args) {
      return this._makeRequest({
        path: "/report/TransactionDetail",
        ...args,
      });
    },
    async createVaultedShopper(args) {
      return this._makeRequest({
        method: "POST",
        path: "/vaulted-shoppers",
        ...args,
      });
    },
    async getVaultedShopper({
      vaultedShopperId, ...args
    }) {
      return this._makeRequest({
        path: `/vaulted-shoppers/${vaultedShopperId}`,
        ...args,
      });
    },
    async updateVaultedShopper({
      vaultedShopperId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/vaulted-shoppers/${vaultedShopperId}`,
        ...args,
      });
    },
  },
};
