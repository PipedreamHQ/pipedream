import { axios } from "@pipedream/platform";
import CryptoJS from "crypto-js";
import {
  CATEGORY_TYPE,
  KLINE_DESC_MAPPING,
  ORDER_STATUS_ACTIVE,
  ORDER_STATUS_CONDITIONAL,
  ORDER_TYPE,
  POSITION_INDEX_TYPE,
  POSITION_MODE,
  SIDE, SORT_ORDER,
  TIME_IN_FORCE, TP_SL_MODE,
  TRIGGER_BY,
  TRIGGER_PRICE_TYPES,
} from "./common/constants.mjs";
export default {
  type: "app",
  app: "bybit",
  description: "ByBit USDT Perpetual",
  propDefinitions: {
    auto_add_margin: {
      description: "Auto add margin",
      type: "boolean",
      optional: false,
    },
    base_price: {
      description: "It will be used to compare with the value of stop_px, to decide whether your " +
          "conditional order will be triggered by crossing trigger price from upper side or lower side. " +
          "Mainly used to identify the expected direction of the current conditional order.",
      type: "string",
      optional: false,
    },
    buy_leverage: {
      label: "Buy Leverage",
      type: "integer",
      description: "Must be greater than 0 and less than the risk limit leverage",
      optional: false,
    },
    category: {
      label: "Category",
      description: "Derivatives products category",
      type: "string",
      optional: false,
      default: "linear",
      options: CATEGORY_TYPE,
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
    from: {
      label: "From",
      type: "integer",
      description: "From timestamp in seconds",
      optional: true,
      default: 1,
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
    is_isolated: {
      label: "Is Isolated",
      description: "Cross/Isolated: true is Isolated; false is Cross",
      type: "boolean",
      optional: false,
    },
    limit: {
      label: "Limit",
      type: "integer",
      description: "Limit for data size, max size is 200. Default as showing 200 pieces of data",
      optional: true,
      max: 200,
    },
    mode: {
      label: "Position Mode",
      type: "string",
      description: "Position Mode. MergedSingle: One-Way Mode; BothSide: Hedge Mode",
      optional: false,
      options() {
        return Object.keys(POSITION_MODE).map((key) => {
          return {
            "label": key,
            "value": POSITION_MODE[key],
          };
        });
      },
    },
    margin: {
      label: "Margin",
      type: "string",
      description: "Add/Remove how much margin: Increase 10; decrease -10, supports 4 decimal places",
      optional: false,
    },
    order: {
      label: "Order",
      type: "string",
      description: "Sort orders by creation date. Defaults to asc\n",
      optional: true,
      options() {
        return Object.keys(SORT_ORDER).map((key) => {
          return {
            "label": key,
            "value": SORT_ORDER[key],
          };
        });
      },
    },
    order_id: {
      label: "Order ID",
      description: "Order ID of the order",
      type: "string",
      optional: true,
    },
    order_link_id: {
      label: "Order Link",
      description: "Unique user-set order ID. Maximum length of 36 characters",
      type: "string",
      optional: true,
    },
    order_status: {
      label: "Order Status",
      description: "Queries orders of all statuses if order_status not provided. " +
          "If you want to query orders with specific statuses, " +
          "you can pass the order_status split by ',' (eg Filled,New).",
      type: "string[]",
      optional: true,
      options: ORDER_STATUS_ACTIVE,
    },
    order_type: {
      label: "Order Type",
      description: "Market/Limit order",
      type: "string",
      optional: false,
      options: ORDER_TYPE,
    },
    page: {
      label: "Page",
      type: "integer",
      description: "By default, gets first page of data. Maximum of 50 pages",
      optional: true,
      max: 50,
    },
    period: {
      label: "Period",
      type: "string",
      description: "Data recording period. 5min, 15min, 30min, 1h, 4h, 1d",
      optional: false,
      default: "1d",
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
    price: {
      label: "Price",
      description: "Order price. Required if you make limit price order",
      type: "string",
      optional: true,
    },
    qty: {
      label: "Quantity",
      description: "Order quantity in cryptocurrency",
      type: "string",
      optional: false,
    },
    reduce_only: {
      label: "Reduce Only",
      description: "True means your position can only reduce in size if this order is triggered. " +
          "When reduce_only is true, take profit/stop loss cannot be set",
      type: "boolean",
      optional: false,
    },
    sell_leverage: {
      label: "Sell Leverage",
      type: "integer",
      description: "Must be greater than 0 and less than the risk limit leverage",
      optional: false,
    },
    side: {
      label: "Side",
      description: "Buy/Sell Side",
      type: "string",
      optional: false,
      options: SIDE,
    },
    sl_size: {
      label: "Stop Loss Quantity",
      description: "Stop loss quantity (when in partial mode)",
      type: "string",
      optional: true,
    },
    sl_trigger_by: {
      label: "Stop Loss Trigger By",
      description: "Stop loss trigger price type, default: LastPrice",
      type: "string",
      optional: true,
      options: TRIGGER_BY,
    },
    stop_loss: {
      label: "Stop Loss",
      description: "Stop loss price, only take effect upon opening the position",
      type: "string",
      optional: true,
    },
    stop_order_status: {
      label: "Order Status",
      description: "Queries orders of all statuses if order_status not provided. " +
          "If you want to query orders with specific statuses, " +
          "you can pass the order_status split by ',' (eg Filled,New).",
      type: "string[]",
      optional: true,
      options: ORDER_STATUS_CONDITIONAL,
    },
    stop_px: {
      label: "Trigger price",
      description: "If you're expecting the price to rise to trigger your conditional order, " +
          "make sure stop_px > max(market price, base_price) else, stop_px < min(market price, base_price)",
      type: "string",
      optional: false,
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
    take_profit: {
      label: "Take Profit",
      description: "Take profit price, only take effect upon opening the position",
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
    tp_size: {
      label: "Take Profit Quantity",
      description: "Take profit quantity (when in partial mode)",
      type: "string",
      optional: true,
    },
    tp_sl_mode: {
      label: "TSL/TP Mode",
      description: "Stop loss and take profit mode\n",
      type: "string",
      optional: false,
      options: TP_SL_MODE,
    },
    tp_trigger_by: {
      label: "Take Profit Trigger By",
      description: "Take profit trigger price type, default: LastPrice",
      type: "string",
      optional: true,
      options: TRIGGER_BY,
    },
    trailing_stop: {
      label: "Trailing Stop",
      description: "Cannot be less than 0, 0 means cancel TS (Not effective under partial mode)",
      type: "string",
      optional: true,
    },
    trigger_by: {
      label: "Trigger Price Type",
      description: "Trigger price type for conditional orders",
      type: "string",
      optional: false,
      options: TRIGGER_BY,
    },
    trigger_price_type: {
      label: "Price Type",
      description: "Price Type for the derivatives",
      type: "string",
      optional: true,
      default: "Last Price",
      options: Object.keys(TRIGGER_PRICE_TYPES),
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
    async makeRequest(method, path, pathParameters, excludes = []) {
      const basicParameters = this._getBasicParameters();
      const parameters = {
        ...this.getAllValidParameters(pathParameters, excludes),
        ...basicParameters,
      };
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
      excludes.push("bybit");
      Object.entries(parameters)
        .filter(([
          , value,
        ]) => Array.isArray(value))
        .forEach(([
          key,
          value,
        ]) => parameters[key] = `${value}`);
      return Object.fromEntries(Object.entries(parameters)
        .filter(([
          key,
          value,
        ]) => !excludes.includes(key) && (value || typeof value == "boolean")));
    },
  },
};
