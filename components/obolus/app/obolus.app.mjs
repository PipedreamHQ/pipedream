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
    getHeaders() {
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
      ...args
    } = {}) {
      try {
        return await axios($, {
          method,
          url: `${BASE_URL}${path}`,
          headers: this.getHeaders(),
          data,
          ...args,
        });
      } catch (error) {
        throw error.response?.data?.error || error.response?.data?.message || error;
      }
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
