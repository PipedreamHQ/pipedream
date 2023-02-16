import { axios } from "@pipedream/platform";
import crypto from "crypto";
import {
  KLINE_DESC_LIST, TRADE_SIDES, TRADE_TYPES,
  TRADE_ACTIONS, TRADE_MARGIN_MODES, TRADE_LEVERAGE_SIDES,
} from "./common.mjs";

export default {
  type: "app",
  app: "bingx",
  propDefinitions: {
    symbol: {
      label: "Symbol",
      description: "Symbol/Ticker/Trading Pair. There must be a hyphen/ \"-\" in the trading pair symbol. eg: BTC-USDT",
      type: "string",
      optional: false,
      default: "BTC-USDT",
      async options() {
        const contractsData = await this.getAllMarketContracts();
        return contractsData.data.contracts.map((contract) => contract.symbol);
      },
    },
    currency: {
      label: "Currency",
      description: "Account Asset",
      type: "string",
      default: "USDT",
      optional: true,
      async options() {
        const contractsData = await this.getAllMarketContracts();
        return contractsData.data.contracts.map((contract) => contract.currency);
      },
    },
    klineType: {
      label: "K-Line Type",
      description: "The type of K-Line (minutes, hours, weeks etc.)",
      type: "string",
      options: KLINE_DESC_LIST,
      optional: false,
    },
    side: {
      label: "Trade Side",
      description: "(Bid/Ask)",
      type: "string",
      options: TRADE_SIDES,
      optional: false,
    },
    leverageSide: {
      label: "Leverage Side",
      description: "Leverage of Long or Short positions",
      type: "string",
      options: TRADE_LEVERAGE_SIDES,
      optional: false,
    },
    entrustPrice: {
      label: "Price",
      description: "Price",
      type: "string",
      optional: false,
    },
    entrustVolume: {
      label: "Volume",
      description: "Volume",
      type: "string",
      optional: false,
    },
    leverage: {
      label: "Position Leverage",
      description: "Position Leverage",
      type: "integer",
      optional: false,
    },
    tradeType: {
      label: "Trade Type",
      description: "Market/Limit",
      type: "string",
      options: TRADE_TYPES,
      optional: false,
    },
    action: {
      label: "Action",
      description: "Open/Close",
      type: "string",
      options: TRADE_ACTIONS,
      optional: false,
    },
    positionId: {
      label: "Position Id",
      description: "ID of the position needs to be closed with one click",
      type: "integer",
      optional: false,
    },
    orderId: {
      label: "Order ID",
      description: "Order ID",
      type: "string",
    },
    pendingOrderIds: {
      label: "Order Ids",
      description: "Array of Order IDs to cancel",
      type: "string[]",
      optional: false,
      async options({
        symbol, prevContext,
      }) {
        const params = {
          lastOrderId: prevContext.lastOrderId || 0,
          length: 20,
        };
        if (symbol) {
          params.symbol = symbol;
        }
        const { orders } = (await this.listPendingOrders(params)).data;
        const options = orders?.map((order) => order.orderId) || [];
        return {
          options,
          context: {
            lastOrderId: options[options.length - 1]?.orderId,
          },
        };
      },
    },
    marginMode: {
      label: "Margin Mode",
      description: "Isolated or Cross\n",
      type: "string",
      options: TRADE_MARGIN_MODES,
      optional: false,
    },
  },
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
    async makeRequest(method, path, pathParameters) {
      const basicParameters = this._getBasicParameters();
      const parameters = {
        ...pathParameters,
        ...basicParameters,
      };
      parameters["sign"] = this._generateSignature(method, path, parameters);
      return await this._makeRequest({
        path: path,
        method: method,
        params: parameters,
      });
    },
    async getAllMarketContracts() {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getAllContracts";
      const parameters = {};
      return await this.makeRequest(API_METHOD, API_PATH, parameters);
    },
    async listPendingOrders(parameters) {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/pendingOrders";
      return this.makeRequest(API_METHOD, API_PATH, parameters);
    },
    convertToFloat(value) {
      if (!isNaN(value)) {
        return parseFloat(value);
      }
    },
  },
};
