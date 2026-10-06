import { axios } from "@pipedream/platform";
import {
  buildWindow,
  normalizeAssetType,
  normalizeIdentifier,
  normalizeIdentifiers,
  normalizeLimit,
  normalizeSource,
} from "./common/utils.mjs";

const BASE_URL = "https://api.adanos.org";

export default {
  type: "app",
  app: "adanos",
  propDefinitions: {
    source: {
      type: "string",
      label: "Stock Source",
      description: "The sentiment source to use for stock requests.",
      options: [
        {
          label: "Reddit",
          value: "reddit",
        },
        {
          label: "X / FinTwit",
          value: "x",
        },
        {
          label: "Financial News",
          value: "news",
        },
        {
          label: "Polymarket",
          value: "polymarket",
        },
      ],
      default: "reddit",
    },
    assetType: {
      type: "string",
      label: "Asset Type",
      description: "The kind of market asset to query.",
      options: [
        {
          label: "Stocks",
          value: "stock",
        },
        {
          label: "Crypto",
          value: "crypto",
        },
      ],
      default: "stock",
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Optional inclusive UTC start date in YYYY-MM-DD format.",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Optional inclusive UTC end date in YYYY-MM-DD format.",
      optional: true,
    },
  },
  methods: {
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: BASE_URL,
        headers: {
          "Accept": "application/json",
          "X-API-Key": this.$auth.api_key,
          ...headers,
        },
        ...args,
      });
    },
    getStockSentiment({
      $, ticker, source, fromDate, toDate,
    }) {
      const normalizedTicker = normalizeIdentifier(ticker, false);
      const normalizedSource = normalizeSource(source);
      return this._makeRequest({
        $,
        url: `/${normalizedSource}/stocks/v1/stock/${normalizedTicker}`,
        params: buildWindow(fromDate, toDate),
      });
    },
    getCryptoSentiment({
      $, symbol, fromDate, toDate,
    }) {
      const normalizedSymbol = normalizeIdentifier(symbol, true);
      return this._makeRequest({
        $,
        url: `/reddit/crypto/v1/token/${normalizedSymbol}`,
        params: buildWindow(fromDate, toDate),
      });
    },
    getTrendingAssets({
      $, assetType, source, limit, fromDate, toDate,
    }) {
      const normalizedAssetType = normalizeAssetType(assetType);
      const path = normalizedAssetType === "crypto"
        ? "/reddit/crypto/v1/trending"
        : `/${normalizeSource(source)}/stocks/v1/trending`;
      return this._makeRequest({
        $,
        url: path,
        params: {
          ...buildWindow(fromDate, toDate),
          limit: normalizeLimit(limit),
        },
      });
    },
    getMarketSentiment({
      $, assetType, source, fromDate, toDate,
    }) {
      const normalizedAssetType = normalizeAssetType(assetType);
      const path = normalizedAssetType === "crypto"
        ? "/reddit/crypto/v1/market-sentiment"
        : `/${normalizeSource(source)}/stocks/v1/market-sentiment`;
      return this._makeRequest({
        $,
        url: path,
        params: buildWindow(fromDate, toDate),
      });
    },
    compareAssets({
      $, assetType, source, identifiers, fromDate, toDate,
    }) {
      const normalizedAssetType = normalizeAssetType(assetType);
      const values = normalizeIdentifiers(identifiers, normalizedAssetType === "crypto");
      const crypto = normalizedAssetType === "crypto";
      return this._makeRequest({
        $,
        url: crypto
          ? "/reddit/crypto/v1/compare"
          : `/${normalizeSource(source)}/stocks/v1/compare`,
        params: {
          ...buildWindow(fromDate, toDate),
          [crypto
            ? "symbols"
            : "tickers"]: values.join(","),
        },
      });
    },
  },
};
