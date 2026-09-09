// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

const BASE_URL = "https://ws.bluesnap.com";
const MIN_LIMIT = 1;
const MAX_LIMIT = 1000;

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
      description: "Reporting period. One of `LAST_24_HOURS`, `LAST_7_DAYS`, `LAST_30_DAYS`, `LAST_MONTH`, `THIS_MONTH`, `THIS_YEAR`, or `CUSTOM`. Use `CUSTOM` together with From Date and To Date.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${BASE_URL}/services/2`;
    },
    _authHeader() {
      const credentials = Buffer.from(`${this.$auth.username}:${this.$auth.password}`).toString("base64");
      return `Basic ${credentials}`;
    },
    async _makeRequest({
      $, method = "GET", path, params, data, ...args
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": this._authHeader(),
          "Content-Type": "application/json",
          "Accept": "application/json",
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
