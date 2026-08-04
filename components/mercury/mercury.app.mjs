// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import { BASE_URL } from "./common/constants.mjs";

export default {
  type: "app",
  app: "mercury",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account ID",
      description: "The account ID (UUID). Run **List Accounts** to obtain a valid ID.",
    },
  },
  methods: {
    _getBaseURL() {
      return BASE_URL;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      endpoint,
      method = "GET",
      params,
      data,
    }) {
      return axios($ || this, {
        method,
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
        data,
      });
    },
    getDateDaysAgo(days) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    },
    getAccounts({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        endpoint: "/accounts",
        params,
      });
    },
    getTransactions({
      $,
      accountId,
      params,
    }) {
      return this._makeRequest({
        $,
        endpoint: `/account/${accountId}/transactions`,
        params,
      });
    },
    getTransaction({
      $,
      accountId,
      transactionId,
    }) {
      return this._makeRequest({
        $,
        endpoint: `/account/${accountId}/transaction/${transactionId}`,
      });
    },
    createTransaction({
      $,
      accountId,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        endpoint: `/account/${accountId}/transactions`,
        data,
      });
    },
    getRecipients({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        endpoint: "/recipients",
        params,
      });
    },
    createRecipient({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        endpoint: "/recipients",
        data,
      });
    },
  },
};
