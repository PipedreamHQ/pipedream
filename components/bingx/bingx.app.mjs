import { axios } from "@pipedream/platform";
import crypto from "crypto";
import {
  KLINE_DESC_LIST, TRADE_SIDES, TRADE_TYPES,
  TRADE_ACTIONS, TRADE_MARGIN_MODES, TRADE_LEVERAGE_SIDES,
  BASE_PATH, VERSION_2_PATH, VERSION_3_PATH,
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
        return contractsData.data.map((contract) => contract.symbol);
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
        return contractsData.data.map((contract) => contract.currency);
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
        const { orders } = (await this.listPendingOrders({
          params,
        })).data;
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
    getUrl(path, version = VERSION_2_PATH) {
      return `${this._apiUrl()}${BASE_PATH}${version}${path}`;
    },
    getParams(pathParameters) {
      const basicParameters = this._getBasicParameters();
      const params = {
        ...pathParameters,
        ...basicParameters,
      };
      params.signature = this._generateSignature(params);
      return params;
    },
    getHeaders(headers) {
      return {
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        "accept": "application/json",
        "X-BX-APIKEY": `${this._apiKey()}`,
        ...headers,
      };
    },
    makeRequest({
      $ = this, path, version, params, headers, ...args
    }) {
      console.log({
        url: this.getUrl(path, version),
        headers: this.getHeaders(headers),
        params: this.getParams(params),
        ...args,
      });
      return axios($, {
        url: this.getUrl(path, version),
        headers: this.getHeaders(headers),
        params: this.getParams(params),
        ...args,
      });
    },
    _apiUrl() {
      return "https://open-api.bingx.com";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _secretKey() {
      return this.$auth.secret_key;
    },
    _getBasicParameters() {
      return {
        "timestamp": Date.now(),
      };
    },
    _generateSignature(paramsMap) {
      const queryString = new URLSearchParams(paramsMap).toString();
      return crypto.createHmac("sha256", this._secretKey())
        .update(queryString)
        .digest("hex");
    },
    getAllMarketContracts(args = {}) {
      return this.makeRequest({
        path: "/quote/contracts",
        ...args,
      });
    },
    listPendingOrders(args = {}) {
      return this.makeRequest({
        path: "/trade/openOrders",
        ...args,
      });
    },
    getBalance(args = {}) {
      return this.makeRequest({
        path: "/user/balance",
        ...args,
      });
    },
    getLatestPrice(args = {}) {
      return this.makeRequest({
        path: "/quote/price",
        ...args,
      });
    },
    getKline(args = {}) {
      return this.makeRequest({
        path: "/quote/klines",
        version: VERSION_3_PATH,
        ...args,
      });
    },
    setLeverage(args = {}) {
      return this.makeRequest({
        path: "/trade/leverage",
        method: "POST",
        ...args,
      });
    },
    createOrder(args = {}) {
      return this.makeRequest({
        path: "/trade/order",
        method: "POST",
        ...args,
      });
    },
    convertToFloat(value) {
      if (!isNaN(value)) {
        return parseFloat(value);
      }
    },
  },
};
