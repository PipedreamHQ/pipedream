# Overview

The Token Metrics API integration for Pipedream provides comprehensive access to cryptocurrency data, analytics, and AI-powered insights. This component enables seamless integration of advanced token metrics, market analysis, and trading intelligence into your automated workflows.

Token Metrics delivers institutional-grade cryptocurrency analytics, including AI-generated reports, trading signals, fundamental and technical analysis, market metrics, and performance data across thousands of digital assets.

# Key Features

- **Comprehensive Token Data**: Access detailed information for thousands of cryptocurrencies including prices, market metrics, and historical data
- **AI-Powered Analytics**: Leverage AI-generated reports, trading signals, and investment analysis
- **Advanced Grading Systems**: Access TM Grades, Fundamental Grades, and Technology Grades for informed decision-making
- **Market Intelligence**: Get market metrics, correlation analysis, and scenario-based price predictions
- **Professional Indices**: Access crypto indices with holdings and performance data
- **OHLCV Data**: Retrieve hourly and daily Open, High, Low, Close, Volume data
- **Quantitative Metrics**: Advanced quantitative analysis and resistance/support levels

# Authentication

To use the Token Metrics API component, you'll need:

1. A Token Metrics account with API access
2. An API key from your Token Metrics dashboard

The API uses API key authentication via the `x-api-key` header. Your API key should be kept secure and not shared publicly.

## Setup Instructions

1. Sign up for a Token Metrics account at https://www.tokenmetrics.com/api
2. Navigate to your [api keys dashboard](https://app.tokenmetrics.com/en/api?tab=keys) and generate an API key
3. In Pipedream, connect the Token Metrics app using your API key
4. The API key will be automatically included in all requests via the `x-api-key` header

# Available Actions

## Core Data Actions
- **Get Tokens**: Retrieve comprehensive token listings with metadata and analytics
- **Get Price**: Fetch current token prices for specified assets
- **Get Top Market Cap Tokens**: Access tokens ranked by market capitalization

## Trading & Signals
- **Get Trading Signals**: AI-generated long/short trading signals for all tokens
- **Get Hourly Trading Signals**: Real-time hourly trading signals
- **Get Moonshot Tokens**: AI-curated high-potential token picks

## Market Analysis
- **Get Market Metrics**: Comprehensive crypto market analytics and sentiment indicators
- **Get Correlation**: Token correlation analysis with top 100 market cap assets
- **Get Scenario Analysis**: Price predictions based on different market scenarios
- **Get Resistance Support**: Historical resistance and support levels

## OHLCV Data
- **Get Hourly OHLCV**: Hourly Open, High, Low, Close, Volume data
- **Get Daily OHLCV**: Daily OHLCV data for historical analysis

## Grading Systems
- **Get TM Grades**: Latest Token Metrics grades with trader and quant scores
- **Get TM Grades Historical**: Historical TM Grade data over time
- **Get Fundamental Grades**: Fundamental analysis scores (community, exchange, VC, tokenomics)
- **Get Fundamental Grades Historical**: Historical fundamental grade data
- **Get Technology Grades**: Technology assessment scores (activity, security, repository)
- **Get Technology Grades Historical**: Historical technology grade data

## Advanced Analytics
- **Get AI Reports**: Comprehensive AI-generated token analysis reports
- **Get Quantmetrics**: Advanced quantitative metrics and analysis
- **Get Crypto Investors**: Latest crypto investor data and scores

## Indices & Performance
- **Get Indices**: Access active and passive crypto indices
- **Get Indices Holdings**: Current holdings and weightings for specific indices
- **Get Indices Performance**: Historical performance data for crypto indices

# Example Use Cases

## Automated Trading Systems
```javascript
// Monitor trading signals and execute automated trades
const signals = await steps.token_metrics.getTradingSignals({
  symbol: "BTC,ETH",
  signal: "1" // Bullish signals only
});

// Process signals and trigger trading actions
```

## Portfolio Management Dashboard
```javascript
// Create comprehensive portfolio tracking
const tokens = await steps.token_metrics.getTokens({
  category: "defi,layer-1",
  limit: 100
});

const grades = await steps.token_metrics.getTmGrades({
  token_id: tokens.data.map(t => t.token_id).join(",")
});

// Combine data for portfolio analysis
```

## Market Research Automation
```javascript
// Generate detailed investment research
const aiReports = await steps.token_metrics.getAiReports({
  symbol: "SOL,AVAX"
});

const fundamentals = await steps.token_metrics.getFundamentalGrades({
  symbol: "SOL,AVAX"
});

// Create comprehensive research reports
```

## Risk Management System
```javascript
// Monitor market conditions and correlations
const marketMetrics = await steps.token_metrics.getMarketMetrics({
  start_date: "2025-07-01",
  end_date: "2025-07-10"
});

const correlations = await steps.token_metrics.getCorrelation({
  symbol: "BTC"
});

// Implement risk management strategies
```

# API Endpoint

Base URL: `https://api.tokenmetrics.com/v2`

All requests require the `x-api-key` header for authentication.

# Rate Limits & Usage

Please refer to the [Token Metrics API documentation](https://developers.tokenmetrics.com/) for current rate limits, usage guidelines, and pricing information.

# Data Filtering & Pagination

Most actions support comprehensive filtering options:

- **Token Identification**: Filter by `token_id`, `symbol`, or `token_name`
- **Market Filters**: Filter by `category`, `exchange`, `market_cap`, `volume`, `fdv`
- **Date Ranges**: Use `start_date` and `end_date` for historical data
- **Pagination**: Control results with `limit` (default: 50) and `page` (default: 1) parameters

# Error Handling

The component includes comprehensive error handling for common scenarios:

- **401 Unauthorized**: Invalid or expired API key
- **403 Forbidden**: Insufficient API key permissions
- **429 Rate Limited**: API rate limit exceeded
- **5xx Server Errors**: Token Metrics API server issues

# Support & Resources

## Official Token Metrics Resources

- **API Dashboard**: [app.tokenmetrics.com/en/api](https://app.tokenmetrics.com/en/api) - Manage your API keys and access
- **API Pricing Plans**: [app.tokenmetrics.com/en/api-plans](https://app.tokenmetrics.com/en/api-plans) - View pricing and plan details
- **Token Metrics API Documentation**: [developers.tokenmetrics.com](https://developers.tokenmetrics.com/) - Complete API reference
- **API Support (Telegram)**: [t.me/tokenmetricsapi](https://t.me/tokenmetricsapi) - Developer community and support
- **Contact Us**: [tokenmetrics.com/contact-us](https://www.tokenmetrics.com/contact-us) - General support and inquiries

## Community & Support

- **Pipedream Community**: For integration and workflow assistance
- **Component Issues**: Report bugs or request features via the Pipedream platform
- **Email Support**: support@tokenmetrics.com for API-related issues

# Version

Current version: 0.0.1

Built with Pipedream Platform v3.0.3
