import { axios } from "@pipedream/platform";
import CryptoJS from "crypto-js";
import {
  CATEGORY_TYPE, KLINE_DESC_MAPPING,
} from "./common.mjs";
export default {
  type: "app",
  app: "bybit",
  description: "ByBit USDT Perpetual",
  propDefinitions: {
    category: {
      label: "Category",
      description: "Derivatives products category",
      type: "string",
      optional: false,
      default: "linear",
      options: CATEGORY_TYPE,
    },
    symbol: {
      label: "Symbol",
      description: "Symbol/Ticker",
      type: "string",
      optional: false,
      default: "",
      async options() {
        const contractsData = await this.getAllSymbols("linear");
        return contractsData.result.list.map((contract) => contract.symbol);
      },
    },
    coin: {
      label: "Coin",
      description: "Quote coin. Like 'USDT' in BTC-USDT.",
      type: "string",
      optional: true,
      default: "",
      async options() {
        const contractsData = await this.getAllSymbols("linear");
        return contractsData.result.list.map((contract) => contract.quoteCoin);
      },
    },
    interval: {
      label: "Interval",
      description: "Data refresh interval. Enum : 1 3 5 15 30 60 120 240 360 720 \"D\" \"M\" \"W\"",
      type: "string",
      optional: false,
      default: "D",
      options() {
        return Object.keys(KLINE_DESC_MAPPING).map((key) => {
          return {
            "label": key,
            "value": KLINE_DESC_MAPPING[key],
          };
        });
      },
    },
    from: {
      label: "From",
      type: "integer",
      description: "From timestamp in seconds",
      optional: true,
      default: 1,
    },
    limit: {
      label: "Limit",
      type: "integer",
      description: "Limit for data size, max size is 200. Default as showing 200 pieces of data",
      optional: true,
      max: 200,
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
    async getAllSymbols(category) {
      const API_METHOD = "GET";
      const API_PATH = "/derivatives/v3/public/instruments-info";
      const parameters = {
        "category": category,
      };
      return await this.makeRequest(API_METHOD, API_PATH, parameters);
    },
    getAllValidParameters(parameters) {
      return Object.fromEntries(Object.entries(parameters).filter(([
        key,
      ]) => !key.includes("bybit") && parameters[key]));
    },
  },
};
