// API endpoints configuration
export const ENDPOINTS = {
  TOKENS: {
    path: "/tokens",
    description: "Get the list of coins and their associated TOKEN_ID supported by Token Metrics",
    filters: [
      "token_id",
      "token_name",
      "symbol",
      "category",
      "exchange",
      "blockchain_address",
    ],
  },
  TRADING_SIGNALS: {
    path: "/trading-signals",
    description: "Get the AI generated trading signals for long and short positions for all tokens",
    filters: [
      "token_id",
      "start_date",
      "end_date",
      "symbol",
      "category",
      "exchange",
      "market_cap",
      "volume",
      "fdv",
      "signal",
    ],
  },
  PRICE: {
    path: "/price",
    description: "Get token prices based on the provided token IDs",
    filters: [
      "token_id",
    ],
  },
  HOURLY_OHLCV: {
    path: "/hourly-ohlcv",
    description: "Get hourly OHLCV (Open, High, Low, Close, Volume) data for tokens",
    filters: [
      "token_id",
      "symbol",
      "token_name",
      "start_date",
      "end_date",
    ],
  },
  DAILY_OHLCV: {
    path: "/daily-ohlcv",
    description: "Get daily OHLCV (Open, High, Low, Close, Volume) data for tokens",
    filters: [
      "token_id",
      "symbol",
      "token_name",
      "start_date",
      "end_date",
    ],
  },
  MOONSHOT_TOKENS: {
    path: "/moonshot-tokens",
    description: "Get the AI-curated token picks (Moonshots) with high breakout potential based on grades, sentiment, volume, and on-chain data to help users trade smarter and faster",
    filters: [
      "type",
    ],
  },
  TM_GRADES: {
    path: "/tm-grade",
    description: "Get the latest TM Grade for a token, including trader grade change, quant grade, signals, momentum, and 24-hour percentage changes for both TM Grade and Trader Grade",
    filters: [
      "token_id",
      "token_name",
      "symbol",
    ],
  },
  TM_GRADES_HISTORICAL: {
    path: "/tm-grade-history",
    description: "Get historical TM Grade data for a token, including trader grade change, quant grade, signals, momentum, and 24-hour percentage changes for both TM Grade and Trader Grade over time",
    filters: [
      "token_id",
      "token_name",
      "symbol",
      "start_date",
      "end_date",
    ],
  },
  FUNDAMENTAL_GRADES: {
    path: "/fundamental-grade",
    description: "Get the latest Fundamental Grade insights for a token, including grade class, community score, exchange score, VC score, tokenomics score, and DeFi scanner score",
    filters: [
      "token_id",
      "token_name",
      "symbol",
    ],
  },
  FUNDAMENTAL_GRADES_HISTORICAL: {
    path: "/fundamental-grade-history",
    description: "Get historical Fundamental Grade insights for a token, including grade class, community score, exchange score, VC score, tokenomics score, and DeFi scanner score over time",
    filters: [
      "token_id",
      "token_name",
      "symbol",
      "start_date",
      "end_date",
    ],
  },
  TECHNOLOGY_GRADES: {
    path: "/technology-grade",
    description: "Get Technology Grade insights for a token, including activity score, security score, repository score, collaboration score, and DeFi scanner score",
    filters: [
      "token_id",
      "token_name",
      "symbol",
    ],
  },
  TECHNOLOGY_GRADES_HISTORICAL: {
    path: "/technology-grade-history",
    description: "Get historical Technology Grade data for a token, including activity score, security score, repository score, collaboration score, and DeFi scanner score over time",
    filters: [
      "token_id",
      "token_name",
      "symbol",
      "start_date",
      "end_date",
    ],
  },
  MARKET_METRICS: {
    path: "/market-metrics",
    description: "Get the Market Analytics from Token Metrics. They provide insight into the full Crypto Market, including the Bullish/Bearish Market indicator",
    filters: [
      "start_date",
      "end_date",
    ],
  },
  AI_REPORTS: {
    path: "/ai-reports",
    description: "Retrieve AI-generated reports providing comprehensive analyses of cryptocurrency tokens, including deep dives, investment analyses, and code reviews",
    filters: [
      "token_id",
      "symbol",
    ],
  },
  CRYPTO_INVESTORS: {
    path: "/crypto-investors",
    description: "Get the latest list of crypto investors and their scores",
    filters: [],
  },
  TOP_MARKET_CAP_TOKENS: {
    path: "/top-market-cap-tokens",
    description: "Get the list of coins for top market cap",
    filters: [
      "top_k",
    ],
  },
  RESISTANCE_SUPPORT: {
    path: "/resistance-support",
    description: "Get the historical levels of resistance and support for each token",
    filters: [
      "token_id",
      "symbol",
    ],
  },
  HOURLY_TRADING_SIGNALS: {
    path: "/hourly-trading-signals",
    description: "Get the hourly AI generated trading signals for long and short positions for all tokens",
    filters: [
      "token_id",
    ],
  },
  QUANTMETRICS: {
    path: "/quantmetrics",
    description: "Get the latest quantitative metrics for tokens. Note that Token Metrics pricing data starts on 2019-01-01 for most tokens. More historical data will be available soon",
    filters: [
      "token_id",
      "symbol",
      "category",
      "exchange",
      "market_cap",
      "volume",
      "fdv",
    ],
  },
  SCENARIO_ANALYSIS: {
    path: "/scenario-analysis",
    description: "Get the price prediction based on different Crypto Market scenario",
    filters: [
      "token_id",
      "symbol",
    ],
  },
  CORRELATION: {
    path: "/correlation",
    description: "Get the Top 10 and Bottom 10 correlation of tokens with the top 100 market cap tokens",
    filters: [
      "token_id",
      "symbol",
      "category",
      "exchange",
    ],
  },
  INDICES: {
    path: "/indices",
    description: "Get active and passive crypto indices with performance and market data",
    filters: [
      "indices_type",
    ],
  },
  INDICES_HOLDINGS: {
    path: "/indices-holdings",
    description: "This endpoint returns the current holdings of the given Index, along with their respective weight in %",
    filters: [
      "id",
    ],
  },
  INDICES_PERFORMANCE: {
    path: "/indices-performance",
    description: "The Indices Performance endpoint provides historical performance data for a given index, including cumulative return on investment (ROI) over time. This data is useful for analyzing index trends and evaluating investment performance",
    filters: [
      "id",
      "start_date",
      "end_date",
    ],
  },
};

// Common filter definitions that can be reused across endpoints
export const FILTER_DEFINITIONS = {
  token_id: {
    type: "string",
    label: "Token ID",
    description: "Comma Separated Token IDs. Example: 3375,3306",
    optional: true,
  },
  token_name: {
    type: "string",
    label: "Token Name",
    description: "Comma Separated Crypto Asset Names (e.g., Bitcoin, Ethereum)",
    optional: true,
  },
  symbol: {
    type: "string",
    label: "Symbol",
    description: "Comma Separated Token Symbols. Example: BTC,ETH",
    optional: true,
  },
  category: {
    type: "string",
    label: "Category",
    description: "Comma Separated category name. Example: yield farming,defi",
    optional: true,
  },
  exchange: {
    type: "string",
    label: "Exchange",
    description: "Comma Separated exchange name. Example: binance,gate",
    optional: true,
  },
  blockchain_address: {
    type: "string",
    label: "Blockchain Address",
    description: "Token addresses separated by colon. Example: binance-smart-chain:0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3",
    optional: true,
  },
  start_date: {
    type: "string",
    label: "Start Date",
    description: "Start Date accepts date as a string - YYYY-MM-DD format. Example: 2023-10-01",
    optional: true,
  },
  end_date: {
    type: "string",
    label: "End Date",
    description: "End Date accepts date as a string - YYYY-MM-DD format. Example: 2023-10-10",
    optional: true,
  },
  market_cap: {
    type: "string",
    label: "Market Cap",
    description: "Minimum Market cap in $. Example: 100000000",
    optional: true,
  },
  volume: {
    type: "string",
    label: "Volume",
    description: "Minimum 24h trading volume in $. Example: 100000000",
    optional: true,
  },
  fdv: {
    type: "string",
    label: "FDV",
    description: "Minimum fully diluted valuation in $. Example: 100000000",
    optional: true,
  },
  signal: {
    type: "string",
    label: "Signal",
    description: "The current signal value of the strategy. Between bullish (1), bearish (-1) or no signal (0)",
    optional: true,
    options: [
      {
        label: "Bullish (1)",
        value: "1",
      },
      {
        label: "No Signal (0)",
        value: "0",
      },
      {
        label: "Bearish (-1)",
        value: "-1",
      },
    ],
  },
  type: {
    type: "string",
    label: "Type",
    description: "Accepts 'active' or 'past' to fetch respective moonshots. Defaults to 'active' if not provided",
    optional: true,
    options: [
      {
        label: "Active",
        value: "active",
      },
      {
        label: "Past",
        value: "past",
      },
    ],
    default: "active",
  },
  top_k: {
    type: "integer",
    label: "Top K",
    description: "Specifies the number of top cryptocurrencies to retrieve, based on their market capitalization. Example: 100",
    optional: true,
  },
  indices_type: {
    type: "string",
    label: "Indices Type",
    description: "Filter to return indices by type: 'active' for actively managed, 'passive' for passively managed",
    optional: true,
    options: [
      {
        label: "Active",
        value: "active",
      },
      {
        label: "Passive",
        value: "passive",
      },
    ],
  },
  id: {
    type: "integer",
    label: "ID",
    description: "ID of the index. Example: 1",
    optional: false,
  },
};

// Common error messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_FAILED: "Authentication failed. Please check your API key.",
  ACCESS_FORBIDDEN: "Access forbidden. Please check your API key permissions.",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later.",
  SERVER_ERROR: "Token Metrics API server error. Please try again later.",
  GENERIC_ERROR: "An error occurred while making the API request",
};
