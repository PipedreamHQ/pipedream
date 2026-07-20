import assert from "node:assert/strict";
import test from "node:test";

import adanos from "../adanos.app.mjs";

function appWithRequestSpy() {
  const calls = [];
  const app = {
    ...adanos.methods,
    _makeRequest(args) {
      calls.push(args);
      return args;
    },
  };
  return {
    app,
    calls,
  };
}

test("stock and crypto detail methods use the documented API paths", async () => {
  const {
    app,
    calls,
  } = appWithRequestSpy();

  await app.getStockSentiment({
    ticker: "$aapl",
    source: "news",
    fromDate: "2026-07-01",
  });
  await app.getCryptoSentiment({
    symbol: "$btc",
    toDate: "2026-07-22",
  });

  assert.deepEqual(calls, [
    {
      $: undefined,
      url: "/news/stocks/v1/stock/AAPL",
      params: {
        from: "2026-07-01",
      },
    },
    {
      $: undefined,
      url: "/reddit/crypto/v1/token/BTC",
      params: {
        to: "2026-07-22",
      },
    },
  ]);
});

test("compare method selects the correct endpoint and query key", async () => {
  const {
    app,
    calls,
  } = appWithRequestSpy();

  await app.compareAssets({
    assetType: "stock",
    source: "x",
    identifiers: [
      "$aapl",
      "MSFT",
      "AAPL",
    ],
  });
  await app.compareAssets({
    assetType: "crypto",
    source: "news",
    identifiers: [
      "$btc",
      "ETH",
    ],
  });

  assert.deepEqual(calls, [
    {
      $: undefined,
      url: "/x/stocks/v1/compare",
      params: {
        tickers: "AAPL,MSFT",
      },
    },
    {
      $: undefined,
      url: "/reddit/crypto/v1/compare",
      params: {
        symbols: "BTC,ETH",
      },
    },
  ]);
});
