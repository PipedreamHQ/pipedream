import app from "../../codex.app.mjs";

export default {
  key: "codex-get-wallet-transactions",
  name: "Get Wallet Transactions",
  description:
    "Returns buy/sell/swap transaction history for a wallet address on a blockchain network."
    + " Each event includes the event type (swap, mint, burn), USD price, timestamp, and transaction hash."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed."
    + " Supports cursor-based pagination — pass `cursor` from the previous response to fetch the next page."
    + " [See the documentation](https://docs.codex.io/reference/gettokeneventsformaker)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    walletAddress: {
      propDefinition: [
        app,
        "walletAddress",
      ],
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
      optional: true,
      description: "Filter events to a specific blockchain network. Use **Get Networks** to find IDs. Leave blank for all networks.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      default: 20,
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const QUERY = `
      query GetWalletTransactions($cursor: String, $limit: Int, $query: MakerEventsQueryInput!) {
        getTokenEventsForMaker(cursor: $cursor, limit: $limit, query: $query) {
          cursor
          items {
            eventType
            transactionHash
            timestamp
            maker
          }
        }
      }
    `;

    const data = await this.app.makeRequest($, QUERY, {
      query: {
        maker: this.walletAddress,
        networkId: this.networkId || undefined,
      },
      limit: this.limit,
      cursor: this.cursor || undefined,
    });

    const result = data.getTokenEventsForMaker;
    const count = result.items?.length ?? 0;
    $.export("$summary", `Retrieved ${count} transaction event(s) for wallet ${this.walletAddress}`);
    return result;
  },
};
