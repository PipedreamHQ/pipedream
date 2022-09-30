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
    async _makeSignedRequest(method, path, parameters) {
      parameters["sign"] = this._generateSignature(method, path, parameters);
      return await this._makeRequest({
        path: path,
        method: method,
        params: parameters,
      });
    },
    async getBalance(currency) {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/getBalance";
      const parameters = this._getBasicParameters();
      parameters["currency"] = currency;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getPositions(symbol) {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/getPositions";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getAllMarketContracts() {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getAllContracts";
      const parameters = this._getBasicParameters();
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getLatestPrice(symbol) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getLatestPrice";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getMarketDepth(symbol, level) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getMarketDepth";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      if (level)
        parameters["level"] = level;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getMarketTrades(symbol) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getMarketTrades";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getLatestFunding(symbol) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getLatestFunding";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getHistoryFunding(symbol) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getHistoryFunding";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getLatestKline(symbol, klineType) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getLatestKline";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      parameters["klineType"] = klineType;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getHistoryKlines(symbol, klineType, startTs, endTs) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getHistoryKlines";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      parameters["klineType"] = klineType;
      parameters["startTs"] = startTs;
      parameters["endTs"] = endTs;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getOpenPositions(symbol) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getOpenPositions";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
    async getTicker(symbol) {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getTicker";
      const parameters = this._getBasicParameters();
      parameters["symbol"] = symbol;
      return await this._makeSignedRequest(API_METHOD, API_PATH, parameters);
    },
  },
};
