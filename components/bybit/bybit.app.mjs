import { axios } from "@pipedream/platform";
import CryptoJS from "crypto-js";
import {
  CATEGORY_TYPE,
  KLINE_DESC_MAPPING,
  ORDER_TYPE,
  POSITION_INDEX_TYPE,
  SIDE,
  TIME_IN_FORCE,
  TRIGGER_BY,
  TRIGGER_PRICE_TYPES,
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
    side: {
      label: "Side",
      description: "Buy/Sell Side",
      type: "string",
      optional: false,
      options: SIDE,
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
    order_type: {
      label: "Order Type",
      description: "Market/Limit order",
      type: "string",
      optional: false,
      options: ORDER_TYPE,
    },
    qty: {
      label: "Quantity",
      description: "Order quantity in cryptocurrency",
      type: "string",
      optional: false,
    },
    price: {
      label: "Price",
      description: "Order price. Required if you make limit price order",
      type: "string",
      optional: true,
    },
    time_in_force: {
      label: "Time In Force",
      description: "Time in force selections (GTC, IOC, FOK)",
      type: "string",
      optional: false,
      options: TIME_IN_FORCE,
      default: "GoodTillCancel",
    },
    reduce_only: {
      label: "Reduce Only",
      description: "True means your position can only reduce in size if this order is triggered. " +
          "When reduce_only is true, take profit/stop loss cannot be set",
      type: "boolean",
      optional: false,
    },
    close_on_trigger: {
      label: "Close On Trigger",
      description: "For a closing order. It can only reduce your position, not increase it. " +
          "If the account has insufficient available balance when the closing order is triggered, " +
          "then other active orders of similar contracts will be cancelled or reduced. " +
          "It can be used to ensure your stop loss reduces your position regardless of current available margin.",
      type: "boolean",
      optional: false,
    },
    order_link_id: {
      label: "Order Link",
      description: "Unique user-set order ID. Maximum length of 36 characters",
      type: "string",
      optional: true,
    },
    take_profit: {
      label: "Take Profit",
      description: "Take profit price, only take effect upon opening the position",
      type: "string",
      optional: true,
    },
    stop_loss: {
      label: "Stop Loss",
      description: "Stop loss price, only take effect upon opening the position",
      type: "string",
      optional: true,
    },
    tp_trigger_by: {
      label: "Take Profit Trigger By",
      description: "Take profit trigger price type, default: LastPrice",
      type: "string",
      optional: true,
      options: TRIGGER_BY,
    },
    sl_trigger_by: {
      label: "Stop Loss Trigger By",
      description: "Stop loss trigger price type, default: LastPrice",
      type: "string",
      optional: true,
      options: TRIGGER_BY,
    },
    position_idx: {
      label: "Position Index",
      description: "Position idx, used to identify positions in different position modes. " +
          "Required if you are under One-Way Mode:\n" +
          "0-One-Way Mode\n" +
          "1-Buy side of both side mode\n" +
          "2-Sell side of both side mode",
      type: "integer",
      optional: true,
      options() {
        return Object.keys(POSITION_INDEX_TYPE).map((key) => {
          return {
            "label": key,
            "value": POSITION_INDEX_TYPE[key],
          };
        });
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
    period: {
      label: "Period",
      type: "string",
      description: "Data recording period. 5min, 15min, 30min, 1h, 4h, 1d",
      optional: false,
      default: "1d",
    },
    limit: {
      label: "Limit",
      type: "integer",
      description: "Limit for data size, max size is 200. Default as showing 200 pieces of data",
      optional: true,
      max: 200,
    },
    triggerPriceType: {
      label: "Price Type",
      description: "Price Type for the derivatives",
      type: "string",
      optional: true,
      default: "Last Price",
      options: Object.keys(TRIGGER_PRICE_TYPES),
    },
    order_status: {
      label: "Order Status",
      description: "Queries orders of all statuses if order_status not provided. " +
          "If you want to query orders with specific statuses, " +
          "you can pass the order_status split by ',' (eg Filled,New).",
      type: "string",
      optional: true,
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
        },
        ...args,
      });
    },
    async makeRequest(method, path, pathParameters, excludes = []) {
      const basicParameters = this._getBasicParameters();
      const parameters = {
        ...this.getAllValidParameters(pathParameters, excludes),
        ...basicParameters,
      };
      Object.keys(parameters).forEach((k) => parameters[k] || delete parameters[k]);
      let queryString = Object.keys(parameters).sort()
        .map((key) => {
          return `${key}=${parameters[key]}`;
        })
        .join("&");
      parameters["sign"] = CryptoJS.HmacSHA256(queryString, this._secretKey()).toString();

      return await this._makeRequest({
        path: path,
        method: method,
        params: parameters,
        data: parameters,
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
    getAllValidParameters(parameters, excludes = []) {
      Object.entries(parameters)
        .filter(([
          , value,
        ]) => typeof value == "boolean")
        .forEach(([
          key,
          value,
        ]) => parameters[key] = value.toString());
      excludes.push("bybit");
      return Object.fromEntries(Object.entries(parameters)
        .filter(([
          key,
        ]) => !excludes.includes(key)));
    },
  },
};
