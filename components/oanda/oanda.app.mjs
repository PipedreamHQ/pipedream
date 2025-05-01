import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "oanda",
  propDefinitions: {
    baseCurrency: {
      type: "string",
      label: "Base Currency",
      description: "The base currency of the currency pair.",
    },
    quoteCurrency: {
      type: "string",
      label: "Quote Currency",
      description: "The quote currency of the currency pair.",
    },
    changeThreshold: {
      type: "number",
      label: "Change Threshold",
      description: "The threshold for significant change in forex rate to trigger the event.",
    },
    instrumentFilter: {
      type: "string",
      label: "Instrument Filter",
      description: "Filter by instrument.",
      optional: true,
    },
    tradeTypeFilter: {
      type: "string",
      label: "Trade Type Filter",
      description: "Filter by trade type.",
      optional: true,
      options: [
        {
          label: "Buy",
          value: "BUY",
        },
        {
          label: "Sell",
          value: "SELL",
        },
      ],
    },
    orderTypeFilter: {
      type: "string",
      label: "Order Type Filter",
      description: "Filter by order type.",
      optional: true,
      options: [
        {
          label: "Market",
          value: "MARKET",
        },
        {
          label: "Limit",
          value: "LIMIT",
        },
        {
          label: "Stop",
          value: "STOP",
        },
      ],
    },
    instrument: {
      type: "string",
      label: "Instrument",
      description: "The financial instrument to be used.",
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "Type of the order.",
      options: [
        {
          label: "Market",
          value: "MARKET",
        },
        {
          label: "Limit",
          value: "LIMIT",
        },
        {
          label: "Stop",
          value: "STOP",
        },
      ],
    },
    units: {
      type: "integer",
      label: "Units",
      description: "Number of units to trade.",
    },
    priceThreshold: {
      type: "number",
      label: "Price Threshold",
      description: "Optional price threshold for the order.",
      optional: true,
    },
    timeInForce: {
      type: "string",
      label: "Time In Force",
      description: "Optional time in force for the order.",
      optional: true,
      options: [
        {
          label: "Good Till Cancelled (GTC)",
          value: "GTC",
        },
        {
          label: "Immediate Or Cancel (IOC)",
          value: "IOC",
        },
        {
          label: "Fill Or Kill (FOK)",
          value: "FOK",
        },
      ],
    },
    granularity: {
      type: "string",
      label: "Granularity",
      description: "The granularity of the historical price data.",
      options: [
        {
          label: "Minute",
          value: "M1",
        },
        {
          label: "Hour",
          value: "H1",
        },
        {
          label: "Daily",
          value: "D",
        },
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time for historical price data (ISO 8601 format).",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time for historical price data (ISO 8601 format).",
    },
  },
  methods: {
    _baseUrl(isDemo = false) {
      return isDemo
        ? "https://api-fxpractice.oanda.com/v3"
        : "https://api-fxtrade.oanda.com/v3";
    },
    _makeRequest({
      $ = this,
      path,
      isDemo,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl(isDemo)}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.personal_token}`,
        },
      });
    },
    async listTrades(opts = {}) {
      const {
        instrumentFilter, tradeTypeFilter, ...otherOpts
      } = opts;
      const params = {};
      if (tradeTypeFilter) {
        params.type = tradeTypeFilter;
      }
      if (instrumentFilter) {
        params.instrument = instrumentFilter;
      }
      return this._makeRequest({
        path: `/accounts/${this.$auth.account_id}/trades`,
        params,
        ...otherOpts,
      });
    },
    async createOrder(opts = {}) {
      const {
        instrument, orderType, units, priceThreshold, timeInForce, ...otherOpts
      } = opts;
      const data = {
        order: {
          type: orderType,
          instrument: instrument,
          units: units,
          timeInForce: timeInForce || "FOK",
        },
      };
      if (priceThreshold) {
        data.order.price = priceThreshold;
      }
      return this._makeRequest({
        method: "POST",
        path: `/accounts/${this.$auth.account_id}/orders`,
        data,
        ...otherOpts,
      });
    },
    async getHistoricalPrices(opts = {}) {
      const {
        instrument, granularity, startTime, endTime, ...otherOpts
      } = opts;
      const params = {
        granularity: granularity,
        from: startTime,
        to: endTime,
      };
      return this._makeRequest({
        path: `/instruments/${instrument}/candles`,
        params,
        ...otherOpts,
      });
    },
    async getOrderStatus(opts = {}) {
      const {
        orderTypeFilter, ...otherOpts
      } = opts;
      const params = {};
      if (orderTypeFilter) {
        params.type = orderTypeFilter;
      }
      return this._makeRequest({
        path: `/accounts/${this.$auth.account_id}/orders`,
        params,
        ...otherOpts,
      });
    },
    async getPricingData(opts = {}) {
      const {
        baseCurrency, quoteCurrency, ...otherOpts
      } = opts;
      const instrument = `${baseCurrency}_${quoteCurrency}`;
      const params = {
        instruments: instrument,
      };
      return this._makeRequest({
        path: "/pricing",
        params,
        ...otherOpts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response = await fn(...opts);
      results = results.concat(response.trades || response.orders || []);
      while (response.nextPage) {
        response = await fn({
          page: response.nextPage,
          ...opts,
        });
        results = results.concat(response.trades || response.orders || []);
      }
      return results;
    },
  },
};
