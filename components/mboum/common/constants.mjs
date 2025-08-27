const INTERVALS = [
  "1m",
  "5m",
  "15m",
  "30m",
  "1h",
  "1d",
  "1wk",
];

const HISTORICAL_DATA_INTERVALS = [
  {
    value: "1m",
    label: "1 min candles",
  },
  {
    value: "2m",
    label: "2 min candles",
  },
  {
    value: "3m",
    label: "3 min candles",
  },
  {
    value: "5m",
    label: "5 mins candles",
  },
  {
    value: "15m",
    label: "15 mins candles",
  },
  {
    value: "30m",
    label: "30 mins candles",
  },
  {
    value: "1wk",
    label: "weekly candles",
  },
  {
    value: "1mo",
    label: "monthly candles",
  },
  {
    value: "1qty",
    label: "quarterly candles",
  },
];

const SERIES_TYPES = [
  {
    value: "open",
    label: "Open Price",
  },
  {
    value: "close",
    label: "Close Price",
  },
  {
    value: "high",
    label: "High Price",
  },
  {
    value: "low",
    label: "Low Price",
  },
];

const MA_TYPES = [
  {
    value: "0",
    label: "Simple Moving Average (SMA)",
  },
  {
    value: "1",
    label: "Exponential Moving Average (EMA)",
  },
  {
    value: "2",
    label: "Weighted Moving Average (WMA)",
  },
  {
    value: "3",
    label: "Double Exponential Moving Average (DEMA)",
  },
  {
    value: "4",
    label: "Triple Exponential Moving Average (TEMA)",
  },
  {
    value: "5",
    label: "Triangular Moving Average (TRIMA)",
  },
  {
    value: "6",
    label: "T3 Moving Average",
  },
  {
    value: "7",
    label: "Kaufman Adaptive Moving Average (KAMA)",
  },
  {
    value: "8",
    label: "MESA Adaptive Moving Average (MAMA)",
  },
];

const INTERNATIONAL_HOLDINGS_TYPES = [
  "TOTAL",
  "INCREASED",
  "NEW",
  "DECREASED",
  "SOLDOUT",
  "ACTIVITY",
];

const STOCK_MODULES = [
  "profile",
  "income-statement",
  "income-statement-v2",
  "balance-sheet",
  "balance-sheet-v2",
  "cashflow-statement",
  "cashflow-statement-v2",
  "financial-data",
  "statistics",
  "ratios",
  "calendar-events",
  "sec-filings",
  "recommendation-trend",
  "upgrade-downgrade-history",
  "insider-transactions",
  "insider-holders",
  "net-share-purchase-activity",
  "earnings",
  "index-trend",
  "industry-trend",
  "sector-trend",
];

const SCREENER_FILTERS = [
  "high_volume",
  "hot_stocks",
  "top_under_10",
  "dividend",
  "top_fundamentals",
  "top_tech",
  "j_pattern",
  "golden_cross",
  "death_cross",
  "consolidation",
  "rsi_overbought",
  "rsi_oversold",
  "52wk_toppicks",
  "penny_gap",
  "defensive_stock",
  "income_growth",
  "buy_longterm",
  "sell_growth",
];

const CRYPTO_MODULES = [
  {
    value: "global_matric",
    label: "Global Metric data",
  },
  {
    value: "trending",
    label: "Top Trending cryptocurrencies",
  },
  {
    value: "most_visited",
    label: "Most visited cryptocurrencies sites",
  },
  {
    value: "new_coins",
    label: "Newly launched cryptocurrencies",
  },
  {
    value: "gainer",
    label: "Top cryptocurrency gainers",
  },
  {
    value: "loser",
    label: "Top cryptocurrency losers",
  },
];

export default {
  INTERVALS,
  MA_TYPES,
  SERIES_TYPES,
  HISTORICAL_DATA_INTERVALS,
  INTERNATIONAL_HOLDINGS_TYPES,
  STOCK_MODULES,
  SCREENER_FILTERS,
  CRYPTO_MODULES,
};
