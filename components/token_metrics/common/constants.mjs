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
};

// Common error messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_FAILED: "Authentication failed. Please check your API key.",
  ACCESS_FORBIDDEN: "Access forbidden. Please check your API key permissions.", 
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later.",
  SERVER_ERROR: "Token Metrics API server error. Please try again later.",
  GENERIC_ERROR: "An error occurred while making the API request",
};
