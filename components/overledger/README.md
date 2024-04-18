# Overview

The Overledger API by Quant Network offers a gateway to cross-blockchain interoperability, allowing you to read and write transactions across multiple blockchains. It's the bridge for decentralized applications (DApps) to communicate across Ethereum, Ripple, Bitcoin, and more. With the Overledger API, you can construct multi-chain applications (MApps), manage complex blockchain operations, and ensure that your services remain blockchain-agnostic.

# Example Use Cases

- **Multi-Chain Payment Processor**: Automate the processing of payments across different cryptocurrencies. For instance, when a payment is received in Bitcoin on Pipedream, trigger a workflow that uses Overledger to perform a corresponding transaction in Ethereum, ensuring liquidity across various digital assets.

- **Cross-Chain Data Retrieval**: Access and consolidate data from various blockchains. For instance, when a smart contract is executed on Ethereum, use Overledger to fetch transaction details and then store them in a Google Sheet via Pipedream's Google Sheets integration, creating a transparent audit trail.

- **Smart Contract Event Monitoring**: Monitor and react to events across diverse blockchains. When a specific contract event occurs, such as a token being transferred on the Binance Smart Chain, use Overledger to capture the event details and send a notification through Slack or Discord via Pipedream to keep your team updated in real-time.
