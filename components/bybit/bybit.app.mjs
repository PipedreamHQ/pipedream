import { axios } from "@pipedream/platform";
import CryptoJS from "crypto-js";
import { CURRENCY } from "./common.mjs";

export default {
  type: "app",
  app: "bybit",
  propDefinitions: {
    symbol: {
      label: "Symbol",
      description: "Symbol/Ticker",
      type: "string",
      optional: false,
      default: "",
      async options() {
        const contractsData = await this.getAllSymbols();
        return contractsData.data.result.map((contract) => contract.name);
      },
    },
    coin: {
      label: "Coin",
      description: "Coin",
      type: "string",
      optional: true,
      default: "",
      options: CURRENCY,
    },
  },
  methods: {
    _apiUrl(sandbox = false) {
      return sandbox
        ? "https://api-testnet.bybit.com"
        : "https://api.bybit.com";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _secretKey() {
      return this.$auth.secret_key;
    },
    _getBasicParameters() {
      return {
        "api_key": `${this._apiKey()}`,
        "timestamp": Date.now(),
      };
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
    async makeRequest(method, path, pathParameters) {
      const basicParameters = this._getBasicParameters();
      const parameters = {
        ...this.getAllValidParameters(pathParameters),
        ...basicParameters,
      };
      Object.keys(parameters).forEach((k) => parameters[k] || delete parameters[k]);
      const queryString = Object.keys(parameters).sort()
        .map((key) => {
          return `${key}=${parameters[key]}`;
        })
        .join("&");
      parameters["sign"] = CryptoJS.HmacSHA256(queryString, this._secretKey()).toString();
      return await this._makeRequest({
        path: path,
        method: method,
        params: parameters,
      });
    },
    async getAllSymbols() {
      const API_METHOD = "GET";
      const API_PATH = "/v2/public/symbols";
      return await this.makeRequest(API_METHOD, API_PATH, {});
    },
    getAllValidParameters(parameters) {
      return Object.fromEntries(Object.entries(parameters).filter(([
        key,
      ]) => !key.includes("bybit") && parameters[key]));
    },
  },
};
