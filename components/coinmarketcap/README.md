# Overview

The CoinMarketCap API offers access to a range of cryptocurrency market data, like current prices, historical trades, and market cap rankings. On Pipedream, you can leverage this data to build powerful, automated workflows that react in real-time to market changes, enabling you to create alerts, analyze trends, or sync price data with other apps for further processing or visualization.

# Example Use Cases

- **Real-time Price Alert to Slack**: Trigger a workflow whenever a cryptocurrency (e.g., Bitcoin) surpasses a specific price threshold. The workflow fetches the latest price from CoinMarketCap and sends a customized alert to a Slack channel, keeping your team instantly informed about critical market movements.

- **Daily Market Summary Email**: Set up a scheduled workflow that pulls daily summary statistics for your portfolio of cryptocurrencies. Combine data from CoinMarketCap with a templating step to format the information, then use an email service like SendGrid to dispatch a comprehensive market roundup to your inbox every morning.

- **Automated Portfolio Tracker**: Build a workflow that runs at intervals, fetching the latest prices for your holdings. Use Pipedream's built-in data stores to log the data, and connect with Google Sheets to update a spreadsheet in real-time, providing you with a dashboard view of your cryptocurrency portfolio's performance.
