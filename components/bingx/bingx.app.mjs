import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  type: "app",
  app: "bingx",
  propDefinitions: {},
  methods: {
    _apiUrl() {
      return "https://api-swap-rest.bingbon.pro";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _secretKey() {
      return this.$auth.secret_key;
    },
    _sortKeys(unordered) {
      return Object.keys(unordered).sort()
        .reduce(
          (obj, key) => {
            obj[key] = unordered[key];
            return obj;
          },
          {},
        );
    },
    _getBasicParameters() {
      return {
        "apiKey": `${this._apiKey()}`,
        "timestamp": Date.now(),
        "currency": "USDT",
      };
    },

    _generateSignature(method, apiPath, paramsMap) {
      const queryString = new URLSearchParams(this._sortKeys(paramsMap)).toString();
      const signatureQueryString = method + apiPath + queryString;
      return crypto.createHmac("sha256", this._secretKey())
        .update(signatureQueryString)
        .digest("base64");
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "accept": "application/json",
        },
        ...args,
      });
    },
    async getBalance() {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/getBalance";
      const parameters = this._getBasicParameters();
      parameters["sign"] = this._generateSignature(API_METHOD, API_PATH, parameters);

      return await this._makeRequest({
        path: API_PATH,
        method: API_METHOD,
        params: parameters,
      });
    },
  },
};
