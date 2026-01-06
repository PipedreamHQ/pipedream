import crypto from "crypto";
import axios from "axios";

export default {
  type: "app",
  app: "bitmex",
  propDefinitions: {
    currency: {
      type: "string",
      label: "Currency",
      description: "Any currency. For all currencies specify \"all\"",
      async options() {
        const assets = await this.getAssetsConfig();
        const currencies = assets.map((asset) => ({
          label: asset.currency || asset.asset,
          value: asset.currency || asset.asset,
        }));
        return [
          {
            label: "All currencies",
            value: "all",
          },
          ...currencies,
        ];
      },
    },
  },
  methods: {
    _apiUrl() {
      return this.$auth.api_url || "https://www.bitmex.com";
    },
    _generateSignature(apiSecret, verb, path, expires, data) {
      const message = verb + path + expires + data;
      return crypto
        .createHmac("sha256", apiSecret)
        .update(message)
        .digest("hex");
    },
    async _makeRequest({
      method = "GET", path, params, data,
    } = {}) {
      const verb = method.toUpperCase();
      const expires = Math.floor(Date.now() / 1000) + 60; // UNIX timestamp in seconds

      // Build query string if params exist
      let fullPath = path;
      let queryString = "";
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([
          key,
          value,
        ]) => {
          if (value != null) {
            searchParams.append(key, value);
          }
        });
        queryString = searchParams.toString();
        if (queryString) {
          fullPath += `?${queryString}`;
        }
      }

      // Handle request body data
      let dataString = "";
      let requestData = null;
      if (data && verb !== "GET") {
        // For POST/PUT requests, convert data to JSON string
        dataString = JSON.stringify(data);
        requestData = data;
      }

      const signature = this._generateSignature(
        this.$auth.api_secret,
        verb,
        fullPath,
        expires,
        dataString,
      );

      const headers = {
        "api-key": this.$auth.api_key,
        "api-expires": expires,
        "api-signature": signature,
      };

      const config = {
        method: verb,
        url: `${this._apiUrl()}${fullPath}`,
        headers,
      };

      if (requestData && verb !== "GET") {
        config.data = requestData;
        headers["Content-Type"] = "application/json";
      }

      const response = await axios(config);
      return response.data;
    },
    async getAssetsConfig() {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/wallet/assets",
      });
    },
    async getUserWallet({ currency } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/user/wallet",
        params: {
          currency,
        },
      });
    },
    async getTradeHistory({
      filter, symbol, columns, count, start, reverse, startTime, endTime, targetAccountId,
      targetAccountIds,
    } = {}) {
      const params = {};
      if (filter != null) {
        params.filter = typeof filter === "string"
          ? filter
          : JSON.stringify(filter);
      }
      if (symbol != null) params.symbol = symbol;
      if (columns != null) {
        params.columns = typeof columns === "string"
          ? columns
          : JSON.stringify(columns);
      }
      if (count != null) params.count = count.toString();
      if (start != null) params.start = start.toString();
      if (reverse != null) params.reverse = reverse;
      if (startTime != null) params.startTime = startTime;
      if (endTime != null) params.endTime = endTime;
      if (targetAccountId != null) params.targetAccountId = targetAccountId.toString();
      if (targetAccountIds != null) {
        params.targetAccountIds = typeof targetAccountIds === "string"
          ? targetAccountIds
          : JSON.stringify(targetAccountIds);
      }

      return this._makeRequest({
        method: "GET",
        path: "/api/v1/execution/tradeHistory",
        params,
      });
    },
    async createOrder({
      symbol, strategy, side, orderQty, price, displayQty, stopPx, clOrdID, clOrdLinkID,
      pegOffsetValue, pegPriceType, ordType, timeInForce, execInst, contingencyType, text,
    } = {}) {
      const data = {};
      if (symbol != null) data.symbol = symbol;
      if (strategy != null) data.strategy = strategy;
      if (side != null) data.side = side;
      if (orderQty != null) data.orderQty = orderQty.toString();
      if (price != null) data.price = price.toString();
      if (displayQty != null) data.displayQty = displayQty.toString();
      if (stopPx != null) data.stopPx = stopPx.toString();
      if (clOrdID != null) data.clOrdID = clOrdID;
      if (clOrdLinkID != null) data.clOrdLinkID = clOrdLinkID;
      if (pegOffsetValue != null) data.pegOffsetValue = pegOffsetValue.toString();
      if (pegPriceType != null) data.pegPriceType = pegPriceType;
      if (ordType != null) data.ordType = ordType;
      if (timeInForce != null) data.timeInForce = timeInForce;
      if (execInst != null) data.execInst = execInst;
      if (contingencyType != null) data.contingencyType = contingencyType;
      if (text != null) data.text = text;

      return this._makeRequest({
        method: "POST",
        path: "/api/v1/order",
        data,
      });
    },
    async getOrders({
      symbol, filter, columns, count, start, reverse, startTime, endTime,
    } = {}) {
      const params = {};
      if (symbol != null) params.symbol = symbol;
      if (filter != null) {
        params.filter = typeof filter === "string"
          ? filter
          : JSON.stringify(filter);
      }
      if (columns != null) {
        params.columns = typeof columns === "string"
          ? columns
          : JSON.stringify(columns);
      }
      if (count != null) params.count = count.toString();
      if (start != null) params.start = start.toString();
      if (reverse != null) params.reverse = reverse;
      if (startTime != null) params.startTime = startTime;
      if (endTime != null) params.endTime = endTime;

      return this._makeRequest({
        method: "GET",
        path: "/api/v1/order",
        params,
      });
    },
    async getPositions({
      filter, columns, count,
    } = {}) {
      const params = {};
      if (filter != null) {
        params.filter = typeof filter === "string"
          ? filter
          : JSON.stringify(filter);
      }
      if (columns != null) {
        params.columns = typeof columns === "string"
          ? columns
          : JSON.stringify(columns);
      }
      if (count != null) params.count = count.toString();

      return this._makeRequest({
        method: "GET",
        path: "/api/v1/position",
        params,
      });
    },
  },
};
