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
    async getBalance(currency) {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/getBalance";
      const parameters = this._getBasicParameters();
      parameters["currency"] = currency;
      parameters["sign"] = this._generateSignature(API_METHOD, API_PATH, parameters);

      return await this._makeRequest({
        path: API_PATH,
        method: API_METHOD,
        params: parameters,
      });
    },
    async getPositions(symbol) {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/getPositions";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      console.log("Parameters before sign :" + parameters);
      parameters["sign"] = this._generateSignature(API_METHOD, API_PATH, parameters);
      console.log("Parameters after sign :" + parameters);
      return await this._makeRequest({
        path: API_PATH,
        method: API_METHOD,
        params: parameters,
      });
    },
  },
};
