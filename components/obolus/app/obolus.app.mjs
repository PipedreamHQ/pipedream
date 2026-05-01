import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";

const BASE_URL = "https://www.obolusfinanz.de/api";

export default {
  type: "app",
  app: "obolus",
  propDefinitions: {
    country: {
      type: "string",
      label: "Country",
      description: "Country code for the calculation, e.g. DE.",
      options: [
        "DE",
        "AT",
        "US",
        "CH",
        "CA",
        "AU",
        "UK",
        "IE",
      ],
      default: "DE",
      reloadProps: true,
    },
  },
  methods: {
    parseJsonObject(rawValue, label) {
      if (!rawValue) {
        return {};
      }

      try {
        const parsed = JSON.parse(rawValue);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("must be a JSON object");
        }
        return parsed;
      } catch (error) {
        throw new ConfigurationError(`${label} must be a valid JSON object. ${error.message}`);
      }
    },
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
          ...headers,
          ...this._getHeaders(),
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
