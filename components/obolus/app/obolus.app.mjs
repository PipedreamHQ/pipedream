import { axios } from "@pipedream/platform";

const BASE_URL = "https://www.obolusfinanz.de/api";

export default {
  type: "app",
  app: "obolus",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Optional public API key for Obolus",
      secret: true,
      optional: true,
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        ...(this.$auth?.apiKey
          ? {
            "x-public-api-key": this.$auth.apiKey,
          }
          : {}),
      };
    },
    async _makeRequest({
      $,
      method,
      path,
      data,
      headers = {},
      ...args
    } = {}) {
      return axios($, {
        method,
        url: `${BASE_URL}${path}`,
        headers: {
          ...this._getHeaders(),
          ...headers,
        },
        data,
        ...args,
      });
    },
    async calculateNetSalary({
      $,
      data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/berechne",
        data,
      });
    },
    async compareSalaryAcrossCountries({
      $,
      data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/taxcompare",
        data,
      });
    },
  },
};
