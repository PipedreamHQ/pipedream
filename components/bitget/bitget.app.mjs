import { createHmac } from "crypto";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bitget",
  propDefinitions: {
    coin: {
      type: "string",
      label: "Coin",
      description: "Currency abbreviation. Search for one or more, separated by commas, up to 10.",
      optional: true,
      async options({ mapper = ({ coin }) => coin }) {
        const response = await this.getSpotMarketCoins();
        return response.data.map(mapper);
      },
    },
    symbol: {
      type: "string",
      label: "Symbol",
      description: "Trading pair symbol",
      optional: true,
      async options({ mapper = ({ symbol }) => symbol }) {
        const response = await this.getSpotMarketSymbols();
        console.log("response!!!", response);
        return response?.data?.map(mapper);
      },
    },
    ticker: {
      type: "string",
      label: "Symbol",
      description: "Trading pair symbol",
      optional: true,
      async options({
        productType,
        mapper = ({ symbol }) => symbol,
      }) {
        if (!productType) {
          return [];
        }

        const response = await this.getFutureMarketTickers({
          params: {
            productType,
          },
        });
        return response?.data?.map(mapper);
      },
    },
    precision: {
      type: "string",
      label: "Precision",
      description: "Price precision, return the cumulative depth according to the selected precision as the step size, enumeration value: `scale0`/`scale1`/`scale2`/`scale3`, `scale0` does not merge, the default value, generally speaking, `scale1` is the merged depth of the trading pair quotation accuracy 10, generally Under normal circumstances, `scale2` is the quotation accuracy 100. Under normal circumstances, `scale3` is the quotation accuracy * 1000. Under normal circumstances, the accuracy corresponding to 0/1/2/3 is based on the actual return parameter **scale**. Each trading pair The quotation accuracy is different. Some currency pairs do not have scale 2. Requests for scales that do not exist for the currency pair will be processed according to the maximum scale. Example: A certain trading pair only has `scale0`/`scale1`, and when `scale2` is requested, it is automatically reduced to `scale1`.",
      options: [
        "scale0",
        "scale1",
        "scale2",
        "scale3",
      ],
      optional: true,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "Fixed gear enumeration value: `1`/`5`/`15`/`50`/`max`, default: `100`, When the actual depth does not meet the limit, return according to the actual gear, and pass in `max` to return the maximum gear of the trading pair.",
      options: [
        "1",
        "5",
        "15",
        "50",
        "max",
      ],
      optional: true,
    },
    granularity: {
      type: "string",
      label: "Granularity",
      description: "Time interval of charts. For the corresponding relationship between granularity and value, refer to the list below.\n- minute: `1min`, `3min`, `5min`, `15min`, `30min`\n- hour: `1h`, `4h`, `6h`, `12h`\n- day: `1day`, `3day`\n- week: `1week`\n- month: `1M`\n- hour in UTC: `6Hutc`, `12Hutc`\n- day in UTC: `1Dutc`, `3Dutc`\n- week in UTC: `1Wutc`\n- month in UTC: `1Mutc`\n- `1m`, `3m`, `5m` can query for one month, `15m` can query for 52 days, `30m` can query for 62 days, `1H` can query for 83 days, `2H` can query for 120 days, `4H` can query for 240 days, `6H` can query for 360 days.",
      options: [
        "1min",
        "3min",
        "5min",
        "15min",
        "30min",
        "1h",
        "4h",
        "6h",
        "12h",
        "1day",
        "3day",
        "1week",
        "1M",
        "6Hutc",
        "12Hutc",
        "1Dutc",
        "3Dutc",
        "1Wutc",
        "1Mutc",
        "1m",
        "3m",
        "5m",
        "15m",
        "30m",
        "1H",
        "2H",
        "4H",
        "6H",
      ],
    },
    kLineParticleSize: {
      type: "string",
      label: "Granularity",
      description: "K-line particle size",
      options: [
        {
          value: "1m",
          label: "1 minute",
        },
        {
          value: "3m",
          label: "3 minutes",
        },
        {
          value: "5m",
          label: "5 minutes",
        },
        {
          value: "15m",
          label: "15 minutes",
        },
        {
          value: "30m",
          label: "30 minutes",
        },
        {
          value: "1H",
          label: "1 hour",
        },
        {
          value: "4H",
          label: "4 hours",
        },
        {
          value: "6H",
          label: "6 hours",
        },
        {
          value: "12H",
          label: "12 hours",
        },
        {
          value: "1D",
          label: "1 day",
        },
        {
          value: "3D",
          label: "3 days",
        },
        {
          value: "1W",
          label: "1 week",
        },
        {
          value: "1M",
          label: "Monthly line",
        },
        {
          value: "6Hutc",
          label: "UTC 6 hour line",
        },
        {
          value: "12Hutc",
          label: "UTC 12 hour line",
        },
        {
          value: "1Dutc",
          label: "UTC 1-day line",
        },
        {
          value: "3Dutc",
          label: "UTC 3-day line",
        },
        {
          value: "1Wutc",
          label: "UTC weekly line",
        },
        {
          value: "1Mutc",
          label: "UTC monthly line",
        },
      ],
    },
    tradeId: {
      type: "string",
      label: "Trade ID",
      description: "Trade ID",
      optional: true,
      async options({ symbol }) {
        if (!symbol) {
          return [];
        }

        const response = await this.getSpotMarketRecentTrades({
          params: {
            symbol,
          },
        });
        return response.data.map(({
          symbol: label,
          tradeId: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    tpslType: {
      type: "string",
      label: "Spot Order Type",
      description: "Spot order type",
      optional: true,
      options: [
        {
          value: "normal",
          label: "SPOT Order (default)",
        },
        {
          value: "tpsl",
          label: "SPOT TP/SL Order",
        },
      ],
    },
    requestTime: {
      type: "string",
      label: "Request Time",
      description: "Request Time, Unix millisecond timestamp",
      optional: true,
    },
    receiveWindow: {
      type: "string",
      label: "Receive Window",
      description: "Valid time window, Unix millisecond timestamp. If it's set, the request is valid only when the time range between the timestamp in the request and the time that server received the request is within receiveWindow",
      optional: true,
    },
    clientOid: {
      type: "string",
      label: "Client Order ID",
      description: "Client Order ID",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "Order ID",
      optional: true,
      async options({ params }) {
        const response = await this.getSpotTradeUnfilledOrders({
          params,
        });
        return response.data.map(({
          orderId: value,
          symbol: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    batchMode: {
      type: "string",
      label: "Batch Mode",
      description: "Batch order mode",
      optional: true,
      options: [
        {
          value: "single",
          label: "Single Currency Mode (default) - symbol in orderList will be ignored",
        },
        {
          value: "multiple",
          label: "Cross-Currency Mode - symbol in orderList is required, symbol outside orderList will be ignored",
        },
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The record start time for the query. Unix millisecond timestamp, e.g. `1690196141868`",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the record for the query. Unix millisecond timestamp, e.g. `1690196141868`",
      optional: true,
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "Product type",
      options: [
        {
          value: "USDT-FUTURES",
          label: "USDT-M Futures",
        },
        {
          value: "COIN-FUTURES",
          label: "Coin-M Futures",
        },
        {
          value: "USDC-FUTURES",
          label: "USDC-M Futures",
        },
        {
          value: "SUSDT-FUTURES",
          label: "USDT-M Futures Demo",
        },
        {
          value: "SCOIN-FUTURES",
          label: "Coin-M Futures Demo",
        },
        {
          value: "SUSDC-FUTURES",
          label: "USDC-M Futures Demo",
        },
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    sign(message, secretKey) {
      const mac = createHmac("sha256", secretKey).update(message, "utf8");
      const digest = mac.digest();
      return Buffer.from(digest).toString("base64");
    },
    preHash({
      timestamp,  method = "GET", path, params, data = "",
    } = {}) {
      const body = typeof(data) === "string"
        ? data
        : JSON.stringify(data);

      const queryString = params
        ? new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).filter(([
              ,
              value,
            ]) => value != null),
          ),
        ).toString()
        : "";

      if (queryString) {
        path += "?" + queryString;
      }

      return timestamp.toString() + method.toUpperCase() + constants.VERSION_PATH + path + body;
    },
    getHeaders(args = {}) {
      const {
        secret_key: secretKey,
        api_key: apiKey,
        secret_passphrase: secretPassphrase,
        demo_environment: demoEnvironment,
      } = this.$auth;

      const timestamp = Date.now();

      const message = this.preHash({
        timestamp,
        ...args,
      });
      console.log("message!!!", message);

      const signature = this.sign(message, secretKey);
      const paptrading = demoEnvironment ?
        "1" :
        "0";

      return {
        "ACCESS-KEY": apiKey,
        "ACCESS-PASSPHRASE": secretPassphrase,
        "ACCESS-TIMESTAMP": timestamp,
        "ACCESS-SIGN": signature,
        paptrading,
        "locale": "en-US",
        "Content-Type": "application/json",
      };
    },
    makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders({
          path,
          ...args,
        }),
      });
    },
    post(args = {}) {
      return this.makeRequest({
        ...args,
        method: "POST",
      });
    },
    // Spot Market Functions
    getSpotMarketCoins(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/public/coins",
      });
    },
    getSpotMarketSymbols(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/public/symbols",
      });
    },
    getSpotMarketVipFeeRate(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/vip-fee-rate",
      });
    },
    getSpotMarketTickers(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/tickers",
      });
    },
    getSpotMarketMergedOrderbook(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/merge-depth",
      });
    },
    getSpotMarketOrderbook(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/orderbook",
      });
    },
    getSpotMarketCandleData(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/candles",
      });
    },
    getSpotMarketAuction(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/auction",
      });
    },
    getSpotMarketHistoryCandleData(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/history-candles",
      });
    },
    getSpotMarketRecentTrades(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/fills",
      });
    },
    getSpotMarketTrades(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/market/fills-history",
      });
    },
    // Spot Trade Functions
    placeSpotTradeOrder(args = {}) {
      return this.post({
        ...args,
        path: "/spot/trade/place-order",
      });
    },
    cancelReplaceSpotTradeOrder(args = {}) {
      return this.post({
        ...args,
        path: "/spot/trade/cancel-replace-order",
      });
    },
    batchCancelReplaceSpotTradeOrders(args = {}) {
      return this.post({
        ...args,
        path: "/spot/trade/batch-cancel-replace-order",
      });
    },
    cancelSpotTradeOrder(args = {}) {
      return this.post({
        ...args,
        path: "/spot/trade/cancel-order",
      });
    },
    batchPlaceSpotTradeOrders(args = {}) {
      return this.post({
        ...args,
        path: "/spot/trade/batch-orders",
      });
    },
    batchCancelSpotTradeOrders(args = {}) {
      return this.post({
        ...args,
        path: "/spot/trade/batch-cancel-order",
      });
    },
    cancelSpotTradeSymbolOrders(args = {}) {
      return this.post({
        ...args,
        path: "/spot/trade/cancel-symbol-order",
      });
    },
    getSpotTradeOrderInfo(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/trade/orderInfo",
      });
    },
    getSpotTradeUnfilledOrders(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/trade/unfilled-orders",
      });
    },
    getSpotTradeHistoryOrders(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/trade/history-orders",
      });
    },
    getSpotTradeFills(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/spot/trade/fills",
      });
    },
    // Future Market Functions
    getFutureMarketVipFeeRate(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/vip-fee-rate",
      });
    },
    getFutureMarketInterestRate(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/union-interest-rate-history",
      });
    },
    getFutureMarketExchangeRate(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/exchange-rate",
      });
    },
    getFutureMarketDiscountRate(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/discount-rate",
      });
    },
    getFutureMarketContractMergeDepth(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/merge-depth",
      });
    },
    getFutureMarketTicker(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/ticker",
      });
    },
    getFutureMarketTickers(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/tickers",
      });
    },
    getFutureMarketRecentFills(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/fills",
      });
    },
    getFutureMarketFillsHistory(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/fills-history",
      });
    },
    getFutureMarketCandleData(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/candles",
      });
    },
    getFutureMarketHistoryCandleData(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/history-candles",
      });
    },
    getFutureMarketHistoryIndexCandleData(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/history-index-candles",
      });
    },
    getFutureMarketHistoryMarkCandleData(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/history-mark-candles",
      });
    },
    getFutureMarketOpenInterest(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/open-interest",
      });
    },
    getFutureMarketSymbolNextFundingTime(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/funding-time",
      });
    },
    getFutureMarketSymbolPrice(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/symbol-price",
      });
    },
    getFutureMarketHistoryFundingRate(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/history-fund-rate",
      });
    },
    getFutureMarketCurrentFundingRate(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/current-fund-rate",
      });
    },
    getFutureMarketContractsOi(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/oi-limit",
      });
    },
    getFutureMarketAllSymbolsContracts(args = {}) {
      return this.makeRequest({
        ...args,
        path: "/mix/market/contracts",
      });
    },
  },
};
