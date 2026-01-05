import { axios } from "@pipedream/platform";
import crypto from "crypto";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "coincatch",
  propDefinitions: {
    productType: {
      type: "string",
      label: "Product Type",
      description: "Product type",
      options: constants.PRODUCT_TYPES,
    },
    marginCoin: {
      type: "string",
      label: "Margin Coin",
      description: "Margin coin",
      async options({ productType }) {
        const { data } = await this.listAccounts({
          params: {
            productType,
          },
        });
        return data.map(({ marginCoin }) => marginCoin);
      },
    },
    symbol: {
      type: "string",
      label: "Symbol",
      description: "Symbol (Must be capitalized)",
      async options({ productType }) {
        const { data } = await this.listSymbols({
          params: {
            productType,
          },
        });
        return data.map(({ symbol }) => symbol);
      },
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Page size",
      default: 100,
      min: 1,
      max: 100,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "Page number",
      default: 1,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time to use. Example: `2025-01-01T00:00:00Z`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time to use. Example: `2025-01-01T00:00:00Z`",
    },
  },
  methods: {
    createSignedHeaders({
      method,
      requestPath,
      queryString = "",
      body = "",
    }) {
      const accessKey = this.$auth.access_key;
      const secretKey = this.$auth.secret_key;
      const passphrase = this.$auth.passphrase;
      const timestamp = Date.now().toString();
      const upperMethod = method.toUpperCase();

      // Build content to sign
      let contentToSign = timestamp + upperMethod + requestPath;
      if (queryString) {
        contentToSign += "?" + queryString;
      }
      if (body) {
        contentToSign += body;
      }

      // Generate signature
      const hmac = crypto.createHmac("sha256", secretKey);
      hmac.update(contentToSign);
      const signature = hmac.digest("base64");

      return {
        timestamp,
        method: upperMethod,
        requestPath,
        queryString,
        body,
        contentToSign,
        signature,
        headers: {
          "ACCESS-KEY": accessKey,
          "ACCESS-SIGN": signature,
          "ACCESS-TIMESTAMP": timestamp,
          "ACCESS-PASSPHRASE": passphrase,
        },
      };
    },
    cleanObject(o) {
      for (var k in o || {}) {
        if (typeof o[k] === "undefined") {
          delete o[k];
        }
      }
    },
    makeRequest({
      $ = this, method = "GET", path, params, data,
    }) {
      if (params) {
        this.cleanObject(params);
      }
      if (data) {
        this.cleanObject(data);
      }
      const resp = this.createSignedHeaders({
        method,
        requestPath: path,
        queryString: params
          ? new URLSearchParams(params).toString()
          : undefined,
        body: data
          ? JSON.stringify(data)
          : undefined,
      });

      const url = `https://api.coincatch.com${resp.requestPath}${resp.queryString
        ? "?" + resp.queryString
        : ""
      }`;

      if (data) {
        resp.headers["Content-Type"] = "application/json";
      }

      // Make the API request
      return axios($, {
        method: resp.method,
        url,
        headers: resp.headers,
        data: resp.body || undefined,
      });
    },
    listAccounts(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/account/accounts",
        ...opts,
      });
    },
    listSymbols(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/market/contracts",
        ...opts,
      });
    },
    getSingleAccount(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/account/account",
        ...opts,
      });
    },
    getHistoryFundingRate(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/market/history-fundRate",
        ...opts,
      });
    },
    getSymbolMarkPrice(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/market/mark-price",
        ...opts,
      });
    },
    getOpenOrders(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/order/current",
        ...opts,
      });
    },
    getCandleData(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/market/candles",
        ...opts,
      });
    },
    getDepth(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/market/depth",
        ...opts,
      });
    },
    getHistoryOrders(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/order/history",
        ...opts,
      });
    },
    getPositionTier(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/market/queryPositionLever",
        ...opts,
      });
    },
    getSingleSymbolTicker(opts = {}) {
      return this.makeRequest({
        path: "/api/mix/v1/market/ticker",
        ...opts,
      });
    },
  },
};
